using System.Security.Claims;
using EntityFramework.Exceptions.Common;
using inertia.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using inertia.Models;
using inertia.Dtos;
using inertia.Enums;
using inertia.Services;
using Microsoft.AspNetCore.Authorization;

namespace inertia.Controllers;

[ApiController]
[Route("[controller]")]
[Produces("application/json")]
[Consumes("application/json")]
public class UsersController : MyControllerBase
{
    private readonly InertiaContext _db;
    private readonly ScootersService _scooters;
    private readonly UsersService _users;
    private readonly AuthenticationTokenService _tokenService;

    public UsersController(
        InertiaContext db, 
        AuthenticationTokenService tokenService,
        ScootersService scooters,
        UsersService users
    )
    {
        _db = db;
        _tokenService = tokenService;
        _scooters = scooters;
        _users = users;
    }

    [HttpPost("signup")]
    public async Task<ActionResult> Signup([FromBody] SignupRequest request)
    {
        var account = await _users.CreateAccount(
            request.Email,
            request.Password,
            request.Name,
            request.UserType
        );
        
        if (account == null)
            return ApplicationError(ApplicationErrorCode.EmailAlreadyUsed, "email already in use");

        return Ok();
    }
    
    [HttpPost("authorize")]
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

    [HttpDelete("authorize")]
    [Authorize]
    public async Task<ActionResult> Logout([FromBody] LogoutRequest request)
    {
        var loginInstance = await _db.LoginInstances.Where(i => i.AccessToken == request.AccessToken).FirstOrDefaultAsync();
        
        if (loginInstance == null)
            return Unauthorized();
        
        loginInstance.LoginState = LoginInstanceState.LoggedOut;
        await _db.SaveChangesAsync();

        return Ok();
    }

    [HttpGet("{accountId}/profile")]
    [Authorize(Policy = Policies.MatchAccountId)]
    public async Task<ActionResult> GetProfile(string accountId)
    {
        var account = await _db.Accounts
            .Where(a => a.AccountId == accountId && a.State != AccountState.Suspended)
            .FirstOrDefaultAsync();

        if (account == null)
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "invalid account id");

        return Ok(account);
    }

    [HttpGet("{accountId}/orders")]
    [Authorize(Policy = Policies.Authenticated)]
    public async Task<ActionResult> GetOrders()
    {
        var accountId = User.FindFirstValue(ClaimTypes.PrimarySid);

        await _scooters.UpdateOrderStatus();
        
        var orders = await _db.Orders
            .Include(e => e.HireOption)
            .Where(e => e.AccountId == accountId)
            .ToListAsync();

        return Ok(orders);
    }
}