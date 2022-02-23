namespace inertia.Dtos;

public record LoginRequest(
    string Email,
    string Password
);