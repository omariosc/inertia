namespace inertia.Dtos;

public record CreateScooterRequest (
    int DepoId,
    bool Available
);