using inertia.Enums;

namespace inertia.Dtos;

public record PatchUserRequest(
    string? Name,
    string? Email,
    string? Password,
    AccountRole? AccountRole
);