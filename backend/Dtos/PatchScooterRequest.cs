namespace inertia.Dtos;

public record PatchScooterRequest(
    int? SoftScooterId = null,
    string? Name = null, 
    int? DepoId = null,
    bool? Available = null
);