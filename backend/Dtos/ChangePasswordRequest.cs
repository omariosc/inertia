namespace inertia.Dtos;

public record ChangePasswordRequest(
    string OldPassword,
    string NewPassword
);
