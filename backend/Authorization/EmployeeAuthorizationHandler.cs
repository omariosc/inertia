using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using inertia.Enums;
using Microsoft.AspNetCore.Authorization;

namespace inertia.Authorization;

public class EmployeeAuthorizationHandler : AuthorizationHandler<EmployeeAuthorization>
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    
    public EmployeeAuthorizationHandler(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }
    
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, EmployeeAuthorization requirement)
    {
        var authHeader = _httpContextAccessor.HttpContext?.Request.Headers.Authorization.ToString()!;

        if (authHeader.Length != 0)
        {
            var token = authHeader.Split(" ").Last();
            var claims = new JwtSecurityTokenHandler().ReadJwtToken(token);
            var accountRole = claims.Claims.First(c => c.Type == ClaimTypes.Role).Value;

            if (accountRole == AccountRole.Employee.ToString() || accountRole == AccountRole.Manager.ToString())
            {
                context.Succeed(requirement);
                return Task.CompletedTask;
            }

        }
        
        context.Fail();
        return Task.CompletedTask;
    }
}