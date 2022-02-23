using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace inertia.Authorization;

public class AccountIdentityHandler : AuthorizationHandler<AccountIdentityAuthorization>
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AccountIdentityHandler(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, AccountIdentityAuthorization requirement)
    {
        var accountId = context.User.FindFirstValue(ClaimTypes.PrimarySid);
        var requestAccountId = _httpContextAccessor.HttpContext?.GetRouteData()?.Values["accountId"]?.ToString();

        if (
            requestAccountId != null &&
            accountId == requestAccountId
        )
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }
        
        context.Fail();
        return Task.CompletedTask;
    }
}