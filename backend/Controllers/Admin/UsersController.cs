using inertia.Dtos;
using inertia.Enums;
using inertia.Exceptions;
using inertia.Models;
using inertia.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace inertia.Controllers.Admin;

/// <summary>
/// Admin Controller for operating on users
/// </summary>
[ApiController]
[Route("api/admin/[controller]")]
[Produces("application/json")]
[Consumes("application/json")]
public class UsersController : MyControllerBase
{
    private readonly InertiaContext _db;
    private readonly UsersService _users;

    public UsersController(
        InertiaContext db, 
        UsersService users
    )
    {
        _db = db;
        _users = users;
    }

    /// <summary>
    /// Gets a list of users.
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    [ProducesResponseType(typeof(List<Account>), 200)]
    public async Task<ActionResult> GetUsers()
    {
        var users = await _db.Accounts
                .ToListAsync();

        return Ok(users);
    }

    /// <summary>
    /// get all the details of a user, by id.
    /// </summary>
    /// <param name="accountId"></param>
    /// <returns></returns>
    [HttpGet("{accountId}")]
    [ProducesResponseType(typeof(ApplicationError), 422)]
    [ProducesResponseType(typeof(Account), 200)]
    public async Task<ActionResult> GetUser(string accountId)
    {
        var account = await _db.Accounts
            .Where(a => a.AccountId == accountId)
            .FirstOrDefaultAsync();

        if (account == null)
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "invalid account id", "account");
        
        return Ok(account);
    }

    /// <summary>
    /// Creates a new user
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPost]
    [ProducesResponseType(typeof(ApplicationError), 422)]
    [ProducesResponseType(typeof(CreateUserResponse), 200)]
    public async Task<ActionResult<CreateUserResponse>> CreateUser([FromBody] CreateUserRequest request)
    {
        try
        {
            var password = UsersService.GeneratePassword();
            var account = await _users.CreateAccount(
                request.Email,
                password,
                request.Name,
                UserType.Regular,
                request.Role
            );
            
            return Ok(new CreateUserResponse(account, password));

        }
        catch (EmailAlreadyExistsException)
        {
            return ApplicationError(ApplicationErrorCode.EmailAlreadyUsed, "email already in use");
        }
    }
    
    /// <summary>
    /// Modifies the details of an user account
    /// </summary>
    /// <param name="accountId"></param>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPatch("{accountId}")]
    [ProducesResponseType(typeof(ApplicationError), 422)]
    [ProducesResponseType(typeof(Account), 200)]
    public async Task<ActionResult> PatchUser(string accountId, [FromBody] PatchUserRequest request)
    {
        var account = await _db.Accounts
            .Where(a => a.AccountId == accountId)
            .FirstOrDefaultAsync();

        if (account == null)
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "invalid account id", "account");

        try
        {
            account = await _users.ModifyAccount(
                account,
                request.Name,
                request.Email,
                request.Password,
                request.AccountRole
            );

            return Ok(account);
        }
        catch (EmailAlreadyExistsException)
        {
            return ApplicationError(ApplicationErrorCode.EmailAlreadyUsed, "email already used");
        }
    }
}