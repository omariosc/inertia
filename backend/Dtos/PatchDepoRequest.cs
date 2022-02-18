namespace inertia.Dtos;

public record PatchDepoRequest(
    string? Name = null,
    float? Latitude = null,
    float? Longitude = null
);