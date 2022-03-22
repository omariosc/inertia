using inertia.Models;

namespace inertia.Dtos;

public record CreateUserResponse(
    Account Account,
    string Password
);