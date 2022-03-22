namespace inertia.Dtos;

public record CreateGuestOrderRequest(
    string Email,
    string PhoneNumber,
    int HireOptionId,
    int ScooterId,
    DateTime StartTime
);