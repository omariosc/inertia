using System.Security.Claims;
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
public class UsersController : Controller
{
    private readonly InertiaContext _db;
    private readonly AuthenticationTokenService _tokenService;

    public UsersController(
        InertiaContext db, 
        AuthenticationTokenService tokenService
    )
    {
        _db = db;
        _tokenService = tokenService;
    }

    [HttpPost("signup")]
    public async Task<ActionResult> Signup([FromBody] SignupRequest request)
    {
        var account = new Account
        {
            AccountId = await Nanoid.Nanoid.GenerateAsync(),
            Name = request.Name,
            Email = request.Email,
            Password = request.Password,
            Role = AccountRole.User,
            State = AccountState.PendingApproval,
            UserType = request.UserType
        };

        await _db.Accounts.AddAsync(account);
        await _db.SaveChangesAsync();
        
        return Ok();
    }
    
    [HttpPost("authorize")]
    public async Task<ActionResult> Login([FromBody] LoginRequest loginRequest)
    {
        var account = await _db.Accounts
            .Where(a => a.Email == loginRequest.Email && a.Password == loginRequest.Password)
            .FirstOrDefaultAsync();

        if (account == null)
            return BadRequest();

        var accessToken = _tokenService.GenerateAccessToken(account);
        if (accessToken == null)
            return BadRequest();

        var now = DateTime.UtcNow;

        await _db.LoginInstances.AddAsync(new LoginInstance
        {
            AccessToken = accessToken,
            CreatedAt = now,
            AccountId = account.AccountId,
            LoginState = LoginInstanceState.Valid
        });

        await _db.SaveChangesAsync();
        
        return Ok(new LoginResponse(account, accessToken));
    }

    [HttpDelete("authorize")]
    [Authorize]
    public async Task<ActionResult> Logout([FromBody] LogoutRequest request)
    {
        var loginInstance = await _db.LoginInstances.Where(i => i.AccessToken == request.AccessToken).FirstOrDefaultAsync();
        
        if (loginInstance == null)
            return UnprocessableEntity();
        
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
            return UnprocessableEntity();

        return Ok(account);
    }

    [HttpGet("{accountId}/orders")]
    [Authorize(Policy = Policies.Authenticated)]
    public async Task<ActionResult> GetOrders()
    {
        var accountId = User.FindFirstValue(ClaimTypes.PrimarySid);

        var orders = await _db.Orders
            .Include(e => e.HireOption)
            .Where(e => e.AccountId == accountId)
            .ToListAsync();

        return Ok(orders);
    }
}