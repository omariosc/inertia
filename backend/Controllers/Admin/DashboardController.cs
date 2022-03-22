using inertia.Authorization;
using inertia.Dtos;
using inertia.Enums;
using inertia.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace inertia.Controllers.Admin;

[ApiController]
[Route("api/admin/[controller]")]
[Produces("application/json")]
[Authorize(Policy = Policies.Employee)]
public class DashboardController : MyControllerBase
{
    private readonly InertiaContext _db;
    private readonly InertiaService _inertia;
    
    public DashboardController(InertiaContext db, InertiaService inertia)
    {
        _db = db;
        _inertia = inertia;
    }

    [HttpGet]
    public async Task<ActionResult<DashboardResponse>> Get()
    {
        var startOfToday = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 0, 0, 0, 0);
        var endOfToday = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 23, 59, 59, 999);
        
        int employeesLoggedIn = await _db.LoginInstances
            .Include(l => l.Account)
            .Where(l => l.Account.Role == AccountRole.Employee)
            .Select(l => l.AccountId)
            .Distinct()
            .CountAsync();
        int usersLoggedIn = await _db.LoginInstances
            .Select(l => l.AccountId)
            .Distinct()
            .CountAsync();
        int scootersInUse = (await _inertia.GetAllScootersCurrentStatus())
            .Count(s => s.ScooterStatus == ScooterStatus.OngoingOrder);
        int scootersUnavailableByStaff = (await _inertia.GetAllScootersCurrentStatus())
            .Count(s => s.ScooterStatus == ScooterStatus.UnavailableByStaff);
        int scootersPendingReturn = (await _inertia.GetAllScootersCurrentStatus())
            .Count(s => s.ScooterStatus == ScooterStatus.PendingReturn);
        float revenueToday = await _db.Orders
            .Where(o => o.CreatedAt >= startOfToday && o.CreatedAt <= endOfToday)
            .Select(o => o.Cost)
            .SumAsync();
        int highPriorityIssues = await _db.Issues
            .Where(i => i.Priority == IssuePriority.High)
            .CountAsync();
        int mediumPriorityIssues = await _db.Issues
            .Where(i => i.Priority == IssuePriority.Medium)
            .CountAsync();
        int lowPriorityIssues = await _db.Issues
            .Where(i => i.Priority == IssuePriority.Low)
            .CountAsync();
        int unassignedPriorityIssues = await _db.Issues
            .Where(i => i.Priority == IssuePriority.None)
            .CountAsync();

        return Ok(new DashboardResponse(
            employeesLoggedIn,
            usersLoggedIn,
            scootersInUse,
            scootersUnavailableByStaff,
            scootersPendingReturn,
            revenueToday,
            highPriorityIssues,
            mediumPriorityIssues,
            lowPriorityIssues,
            unassignedPriorityIssues
            ));
    }
}