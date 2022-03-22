namespace inertia.Dtos;

public record DashboardResponse(
    int EmployeesLoggedIn,
    int UsersLoggedIn,
    int ScootersInUse,
    int ScootersUnavailableByStaff,
    int ScootersPendingReturn,
    float RevenueToday,
    int HighPriorityIssues,
    int MediumPriorityIssues,
    int LowPriorityIssues,
    int UnassignedPriorityIssues
);