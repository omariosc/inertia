namespace inertia.Dtos;

public record CreateScooterRequest (
    int SoftScooterId,
    string Name, 
    int DepoId,
    bool Available
);