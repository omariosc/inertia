namespace inertia.Authorization;

/// <summary>
/// List of policies that can be used an the Authorize attribute
/// </summary>
public class Policies
{
    public const string Authenticated = "Authenticated";
    public const string MatchAccountId = "MatchAccountId";
    public const string Employee = "Employee";
}