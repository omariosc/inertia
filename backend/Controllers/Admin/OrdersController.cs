using inertia.Authorization;
using inertia.Enums;
using inertia.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Writers;

namespace inertia.Controllers.Admin;

[ApiController]
[Route("admin/[controller]")]
[Produces("application/json")]
[Authorize(Policy = Policies.Staff)]
public class OrdersController : MyControllerBase
{
    private readonly InertiaContext _db;

    public OrdersController(InertiaContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult> List()
    {
        var list = await _db.Orders
            .Include(e => e.Scooter)
            .Include(e => e.Extensions)
            .Where(e => e.ExtendsId == null)
            .ToListAsync();
        return Ok(list);
    }

    [HttpPost("{orderId}/approve")]
    public async Task<ActionResult> ApproveOrder(string orderId)
    {
        var order = await _db.Orders
            .Where(o => o.OrderId == orderId)
            .FirstOrDefaultAsync();

        if (order is null)
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "order id invalid", "order");

        order.OrderState = OrderState.Upcoming;
        await _db.SaveChangesAsync();
        
        return Ok();
    }

    [HttpPost("{orderId}/deny")]
    public async Task<ActionResult> DenyOrder(string orderId)
    {
        var order = await _db.Orders
            .Where(o => o.OrderId == orderId)
            .FirstOrDefaultAsync();

        if (order is null)
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "order id invalid", "order");
        
        order.OrderState = OrderState.Denied;
        await _db.SaveChangesAsync();
        
        return Ok();
    }
    
}