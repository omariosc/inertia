namespace inertia.Dtos;

public record CreateDepoRequest(
    string Name,
    string Address,
    float Latitude,
    float Longitude
);