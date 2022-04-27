namespace inertia.Dtos;

public record PatchDepoRequest(
    string? Name = null,
    string? Address = null,
    float? Latitude = null,
    float? Longitude = null
);