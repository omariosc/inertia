namespace inertia.Dtos;

public record CreateHireOptionRequest(
    int DurationInHours,
    string Name,
    float Cost
);
