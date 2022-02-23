namespace inertia.Dtos;

public record CreateDepoRequest(
    string Name,
    float Latitude,
    float Longitude
);