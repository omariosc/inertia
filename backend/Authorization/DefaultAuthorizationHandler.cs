using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using inertia.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace inertia.Authorization;

public class DefaultAuthorizationHandler : AuthorizationHandler<DefaultAuthorization>
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly InertiaContext _db;

    public DefaultAuthorizationHandler(InertiaContext db, IHttpContextAccessor httpContextAccessor)
    {
        _db = db;
        _httpContextAccessor = httpContextAccessor;
    }

    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context,
        DefaultAuthorization requirement)
    {
        var authHeader = _httpContextAccessor.HttpContext?.Request.Headers.Authorization.ToString()!;
        if (authHeader.Length != 0)
        {
            var token = authHeader.Split(" ").Last();
            var claims = new JwtSecurityTokenHandler().ReadJwtToken(token);
            var accountId = claims.Claims.First(c => c.Type == ClaimTypes.PrimarySid).Value;
            var loginInstance = 
                await _db.LoginInstances
                    .Where(i => i.AccountId == accountId && i.AccessToken == token)
                    .FirstOrDefaultAsync();

            if (loginInstance is not null && loginInstance.LoginState == LoginInstanceState.Valid)
            {
                context.Succeed(requirement);
                return;
            }
        }

        context.Fail();
    }
}