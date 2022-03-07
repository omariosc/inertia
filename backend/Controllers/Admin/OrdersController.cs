using inertia.Authorization;
using inertia.Enums;
using inertia.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace inertia.Controllers.Admin;

[ApiController]
[Route("admin/[controller]")]
[Produces("application/json")]
public class OrdersController : Controller
{
    private readonly InertiaContext _db;

    public OrdersController(InertiaContext db)
    {
        _db = db;
    }

    [HttpGet]
    [Authorize(Policy = Policies.Staff)]
    public async Task<ActionResult> List()
    {
        var list = await _db.Orders
            .Include(e => e.Scooter)
            .Include(e => e.Extensions)
            .Where(e => e.ExtendsId == null)
            .ToListAsync();
        return Ok(list);
    }
    
}