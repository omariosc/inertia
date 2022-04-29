using System.Security.Claims;
using EntityFramework.Exceptions.Common;
using inertia.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using inertia.Models;
using inertia.Dtos;
using inertia.Enums;
using inertia.Exceptions;
using inertia.Services;
using Microsoft.AspNetCore.Authorization;

namespace inertia.Controllers;

/// <summary>
/// Controller for providing all account related functionality
/// (applying for discounts, login, signup, modify account)
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Consumes("application/json")]
public class UsersController : MyControllerBase
{
    private readonly InertiaContext _db;
    private readonly InertiaService _inertia;
    private readonly UsersService _users;
    private readonly AuthenticationTokenService _tokenService;
    private readonly EmailService _email;

    public UsersController(
        InertiaContext db, 
        AuthenticationTokenService tokenService,
        InertiaService inertia,
        UsersService users,
        EmailService email
    )
    {
        _db = db;
        _tokenService = tokenService;
        _inertia = inertia;
        _users = users;
        _email = email;
    }

    /// <summary>
    /// Allows user to sign up.
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPost("signup")]
    [ProducesResponseType(typeof(ApplicationError), 422)]
    [ProducesResponseType(typeof(void), 200)]
    public async Task<ActionResult> Signup([FromBody] SignupRequest request)
    {
        try
        {
            var account = await _users.CreateAccount(
                request.Email,
                request.Password,
                request.Name,
                UserType.Regular,
                AccountRole.User
            );

            await _email.SendSignup(account.Email, account);
        }
        catch (EmailAlreadyExistsException)
        {
            return ApplicationError(ApplicationErrorCode.EmailAlreadyUsed, "email already in use");
        }
        
        return Ok();
    }
    
    /// <summary>
    /// Allows user to log in in their account.
    /// </summary>
    /// <param name="loginRequest"></param>
    /// <returns></returns>
    [HttpPost("authorize")]
    [ProducesResponseType(typeof(ApplicationError), 422)]
    [ProducesResponseType(typeof(LoginResponse), 200)]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest loginRequest)
    {
        var account = await _users.MatchAccount(loginRequest.Email, loginRequest.Password);
        
        if (account == null)
            return ApplicationError(ApplicationErrorCode.InvalidLogin, "email or password invalid");

        var accessToken = _tokenService.GenerateAccessToken(account);
        if (accessToken == null)
            return ApplicationError(ApplicationErrorCode.InvalidLogin, "email or password invalid");

        try
        {
            var now = DateTime.UtcNow;

            await _db.LoginInstances.AddAsync(new LoginInstance
            {
                AccessToken = accessToken,
                CreatedAt = now,
                AccountId = account.AccountId,
                LoginState = LoginInstanceState.Valid
            });

            await _db.SaveChangesAsync();
        }
        catch (UniqueConstraintException)
        {
            return ApplicationError(ApplicationErrorCode.Other, "too many login requests");
        }

        
        return Ok(new LoginResponse(account, accessToken));
    }

    /// <summary>
    /// Allows users to logout (and as such invalidate the access token) from their account. 
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpDelete("authorize")]
    [Authorize]
    [ProducesResponseType(typeof(void), 200)]
    public async Task<ActionResult> Logout([FromBody] LogoutRequest request)
    {
        var loginInstance = await _db.LoginInstances.Where(i => i.AccessToken == request.AccessToken).FirstOrDefaultAsync();
        
        if (loginInstance == null)
            return Unauthorized();
        
        loginInstance.LoginState = LoginInstanceState.LoggedOut;
        await _db.SaveChangesAsync();

        return Ok();
    }

    /// <summary>
    /// Returns all the details of the logged in user account.
    /// </summary>
    /// <param name="accountId"></param>
    /// <returns></returns>
    [HttpGet("{accountId}/profile")]
    [Authorize(Policy = Policies.MatchAccountId)]
    [ProducesResponseType(typeof(ApplicationError), 422)]
    [ProducesResponseType(typeof(Account), 200)]
    public async Task<ActionResult> GetProfile(string accountId)
    {
       var account = await _db.Accounts
            .Where(a => a.AccountId == accountId && a.State != AccountState.Suspended)
            .FirstOrDefaultAsync();
        
        if (account == null)
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "invalid account id");

        return Ok(account);
    }

    /// <summary>
    /// Returns a list of orders made by the currently logged in user account.
    /// </summary>
    /// <param name="accountId"></param>
    /// <returns></returns>
    [HttpGet("{accountId}/orders")]
    [Authorize(Policy = Policies.MatchAccountId)]
    [ProducesResponseType(typeof(ApplicationError), 422)]
    [ProducesResponseType(typeof(List<Order>), 200)]
    public async Task<ActionResult> GetOrders(string accountId)
    {
        await _inertia.UpdateOrderStatus();
        
        var orders = await _db.Orders
            .Include(e => e.HireOption)
            .Include(e=>e.Scooter)
            .ThenInclude(s=>s.Depo)
            .Include(e=>e.Account)
            .Include(e => e.Extensions)
            .Where(e => e.AccountId == accountId && e.Extends == null)
            .ToListAsync();

        return Ok(orders);
    }

    /// <summary>
    /// Returns a list of issues made by the currently logged in user account.
    /// </summary>
    /// <param name="accountId"></param>
    /// <returns></returns>
    [HttpGet("{accountId}/issues")]
    [Authorize(Policy = Policies.MatchAccountId)]
    [ProducesResponseType(typeof(ApplicationError), 422)]
    [ProducesResponseType(typeof(List<Issue>), 200)]
    public async Task<ActionResult> GetIssues(string accountId)
    {
       var issues = await _db.Issues
            .OrderByDescending(i => i.DateOpened)
            .Include(i=>i.Account)
            .Where(i => i.AccountId == accountId)
            .ToListAsync();

        return Ok(issues);
    }
    
    /// <summary>
    /// Create an issues
    /// </summary>
    /// <param name="accountId"></param>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPost("{accountId}/issues")]
    [Authorize(Policy = Policies.MatchAccountId)]
    [ProducesResponseType(typeof(ApplicationError), 422)]
    [ProducesResponseType(typeof(Issue), 200)]
    public async Task<ActionResult> CreateIssue(
        string accountId, 
        [FromBody] CreateIssueRequest request)
    {
        var account = await _db.Accounts
            .Where(a => a.AccountId == accountId)
            .FirstOrDefaultAsync();

        if (account == null)
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "invalid account", "account");

        if (account.Role != AccountRole.Employee && request.Priority != null)
            return Unauthorized();

        var priority = request.Priority ?? IssuePriority.None;

        var issue = new Issue
        {
            Priority = priority,
            Title = request.Title,
            Content = request.Content,
            Account = account,
            DateOpened = DateTime.UtcNow
        };
        await _db.Issues.AddAsync(issue);
        await _db.SaveChangesAsync();

        return Ok(issue);
    }
    
    /// <summary>
    /// Get all the details of an issue submitted by the currently logged in user account
    /// </summary>
    /// <param name="accountId"></param>
    /// <param name="issueId"></param>
    /// <returns></returns>
    [HttpGet("{accountId}/issues/{issueId:int}")]
    [Authorize(Policy = Policies.MatchAccountId)]
    [ProducesResponseType(typeof(ApplicationError), 422)]
    [ProducesResponseType(typeof(Issue), 200)]
    public async Task<ActionResult> GetIssue(string accountId, int issueId)
    {
       var issue = await _db.Issues
            .Where(i => i.IssueId == issueId && i.AccountId == accountId)
            .Include(i=>i.Account)
            .FirstOrDefaultAsync();

        if (issue == null)
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "invalid issue id", "issue");
        
        return Ok(issue);
    }
    
    /// <summary>
    /// Remove an issue submitted by the currently logged in user account
    /// </summary>
    /// <param name="accountId"></param>
    /// <param name="issueId"></param>
    /// <returns></returns>
    [HttpDelete("{accountId}/issues/{issueId:int}")]
    [Authorize(Policy = Policies.MatchAccountId)]
    [ProducesResponseType(typeof(ApplicationError), 422)]
    [ProducesResponseType(typeof(void), 200)]
    public async Task<ActionResult> CloseIssue(string accountId, int issueId)
    {
        var issue = await _db.Issues
            .Where(i => i.AccountId == accountId && i.IssueId == issueId)
            .FirstOrDefaultAsync();

        if (issue == null)
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "invalid issue id", "issue");

        if (issue.Resolution == null)
            return ApplicationError(ApplicationErrorCode.AttemptingToCloseAlreadyClosedIssue,
                "cannot close issue after it had been already closed");

        issue.Resolution = "Closed by user.";
        await _db.SaveChangesAsync();

        return Ok();
    }

    /// <summary>
    /// Apply for discount
    /// </summary>
    /// <param name="accountId"></param>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPost("{accountId}/ApplyDiscount")]
    [Authorize(Policy = Policies.MatchAccountId)]
    [ProducesResponseType(typeof(ApplicationError), 422)]
    [ProducesResponseType(typeof(DiscountApplication), 200)]
    public async Task<ActionResult> ApplyDiscount(
        string accountId,
        [FromBody]ApplyDiscountRequest request)
    {
        var account = await _db.Accounts
            .Where(a => a.AccountId == accountId)
            .FirstOrDefaultAsync();

        if (account == null)
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "invalid account", "account");

        if (account.UserType != UserType.Regular)
            return ApplicationError(ApplicationErrorCode.AlreadyAppliedForDiscount, "already applied for discount");
        
        try
        {
            var application = new DiscountApplication
            {
                Account = account,
                DisccountType = request.DiscountType,
                State = DiscountApplicationState.AwaitingImage
            };

            await _db.DiscountApplications.AddAsync(application);
            await _db.SaveChangesAsync();
            
            return Ok(application);
        }
        catch (UniqueConstraintException)
        {
            return ApplicationError(ApplicationErrorCode.AlreadyAppliedForDiscount, "already applied for discount");
        }
    }

    /// <summary>
    /// Helper endpoints that allows for uploading images
    /// </summary>
    /// <param name="accountId"></param>
    /// <param name="image"></param>
    /// <returns></returns>
    [HttpPost("{accountId}/ApplyDiscountUploadImage")]
    [Authorize(Policy = Policies.MatchAccountId)]
    [Consumes("application/octet-stream")]
    [ProducesResponseType(typeof(ApplicationError), 422)]
    [ProducesResponseType(typeof(void), 200)]
    public async Task<ActionResult> ApplyDiscountUploadImage(
        string accountId,
        [FromBody] byte[] image)
    {
        var application = await _db.DiscountApplications
            .Where(a => a.AccountId == accountId)
            .FirstOrDefaultAsync();

        if (application is null)
            return ApplicationError(ApplicationErrorCode.DiscountApplicationNotAwaitingImageForUser,
                "discount application not awaiting image from user");
        
        if (application.State != DiscountApplicationState.AwaitingImage)
            return ApplicationError(ApplicationErrorCode.DiscountApplicationNotAwaitingImageForUser,
                "discount application not awaiting image from user");

        application.Image = image;
        application.State = DiscountApplicationState.Pending;
        await _db.SaveChangesAsync();

        return Ok();
    }

    /// <summary>
    /// Change password for the currently logged in user
    /// </summary>
    /// <param name="accountId"></param>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPost("{accountId}/ChangePassword")]
    [Authorize(Policy = Policies.MatchAccountId)]
    [ProducesResponseType(typeof(ApplicationError), 422)]
    [ProducesResponseType(typeof(void), 200)]
    public async Task<ActionResult> ChangePassword(
        string accountId,
        [FromBody] ChangePasswordRequest request
    )
    {
        var account = await _db.Accounts
            .Where(a => a.AccountId == accountId)
            .FirstOrDefaultAsync();
        
        if (account is null)
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "invalid account id");

        if ((await _users.MatchAccount(account.Email, request.OldPassword)) == null)
            return ApplicationError(ApplicationErrorCode.InvalidLogin, "incorrect password");

        await _users.ModifyAccount(
            account,
            null,
            null,
            request.NewPassword,
            null
        );

        return Ok();
    }

}