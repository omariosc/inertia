using inertia.Enums;

namespace inertia.Dtos;

public record CreateUserRequest(
    string Name,
    string Email,
    AccountRole Role
);