using inertia.Enums;

namespace inertia.Dtos;

public record ApplicationError(
    string Message,
    ApplicationErrorCode ErrorCode,
    string? Detail
);