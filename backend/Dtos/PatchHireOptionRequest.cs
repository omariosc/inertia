namespace inertia.Dtos;

public record PatchHireOptionRequest(
    int? DurationInHours,
    string? Name,
    float? Cost
);
