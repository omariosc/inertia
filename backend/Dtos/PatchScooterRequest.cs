namespace inertia.Dtos;

public record PatchScooterRequest(
    int? DepoId = null,
    bool? Available = null
);