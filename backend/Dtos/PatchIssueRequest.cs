using inertia.Enums;

namespace inertia.Dtos;

public record PatchIssueRequest(
    string? Resolution,
    IssuePriority? Priority
);