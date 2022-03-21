using inertia.Enums;

namespace inertia.Dtos;

public record CreateIssueRequest(
    IssuePriority? Priority,
    string Title,
    string Content
);