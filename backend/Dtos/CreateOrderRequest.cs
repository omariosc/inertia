namespace inertia.Dtos;

public record CreateOrderRequest(
    int HireOptionId,
    int ScooterId,
    DateTime StartTime
);