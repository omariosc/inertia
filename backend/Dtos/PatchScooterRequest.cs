namespace inertia.Dtos;

public record PatchScooterRequest(
    int? ScooterId = null,
    string? Name = null, 
    int? DepoId = null,
    bool? Available = null
);