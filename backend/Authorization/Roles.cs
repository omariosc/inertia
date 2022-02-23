using inertia.Enums;

namespace inertia.Authorization;

public class Roles
{
    public const string User = nameof(AccountRole.User);
    public const string Staff = nameof(AccountRole.Staff);
    public const string Admin = nameof(AccountRole.Admin);
}