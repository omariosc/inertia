namespace inertia.Dtos;

public record SignupRequest(
    string Name,
    string Email,
    string Password
);