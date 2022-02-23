using inertia.Models;

namespace inertia.Dtos;

public record LoginResponse(
    Account Account,
    string AccessToken
);

