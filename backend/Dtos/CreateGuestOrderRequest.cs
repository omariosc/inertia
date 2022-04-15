namespace inertia.Dtos;

public record CreateGuestOrderRequest(
    string Email,
    string Name,
    int HireOptionId,
    int ScooterId,
    DateTime StartTime
);