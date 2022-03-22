using inertia.Authorization;
using inertia.Dtos;
using inertia.Enums;
using inertia.Exceptions;
using inertia.Models;
using inertia.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace inertia.Controllers.Admin;

[ApiController]
[Route("api/admin/[controller]")]
[Produces("application/json")]
[Authorize(Policy = Policies.Employee)]
public class OrdersController : MyControllerBase
{
    private readonly InertiaContext _db;
    private readonly InertiaService _inertia;

    public OrdersController(InertiaContext db, InertiaService inertia)
    {
        _db = db;
        _inertia = inertia;
    }

    [HttpGet("AccountOrders")]
    public async Task<ActionResult> ListOrders()
    {
        var list = await _db.Orders
            .OfType<Order>()
            .Include(e => e.Scooter)
            .Include(e => e.Extensions)
            .Where(e => e.ExtendsId == null)
            .ToListAsync();
        return Ok(list);
    }
    
    [HttpGet("GuestOrders")]
    public async Task<ActionResult> ListGuestOrders()
    {
        var list = await _db.Orders
            .OfType<GuestOrder>()
            .Include(e => e.Scooter)
            .Include(e => e.Extensions)
            .Where(e => e.ExtendsId == null)
            .ToListAsync();
        return Ok(list);
    }

    [HttpPost("CreateGuestOrder")]
    public async Task<ActionResult> CreateGuestOrder([FromBody] CreateGuestOrderRequest createOrder)
    {
        var scooter = await _db.Scooters
            .Where(e => e.ScooterId == createOrder.ScooterId)
            .FirstOrDefaultAsync();

        var hireOption = await _db.HireOptions
            .Where(e => e.HireOptionId == createOrder.HireOptionId)
            .FirstOrDefaultAsync();

        if (scooter is null)
        {
            return ApplicationError(
                ApplicationErrorCode.InvalidEntity, 
                "Scooter is invalid", 
                "scooter"
            );
        }

        if (hireOption is null)
        {
            return ApplicationError(
                ApplicationErrorCode.InvalidEntity, 
                "Hire option is not available", 
                "hireOption"
            );
        }

        try
        {
            var order = await _inertia.CreateGuestOrder(
                createOrder.Email,
                createOrder.PhoneNumber,
                scooter,
                hireOption,
                createOrder.StartTime
            );
            return Ok(order);
        }
        catch (UnavailableScooterException)
        {
            return ApplicationError(ApplicationErrorCode.ScooterUnavailable, "The Scooter is not available");
        }
    }

    [HttpPost("{orderId}/cancel")]
    public async Task<ActionResult> CancelOrder(string orderId)
    {
        var order = await _db.Orders
            .OfType<Order>()
            .Include(e => e.Extensions)   
            .Where(e => e.OrderId == orderId)
            .FirstOrDefaultAsync();

        if(order is null)
        {
            return ApplicationError(
                ApplicationErrorCode.InvalidEntity, 
                "Order is invalid", 
                "order"
            );
        }

        try
        {
            await _inertia.CancelOrder(order);
        }
        catch (OrderApprovedOrOngoingException)
        {
            return ApplicationError(
                ApplicationErrorCode.OrderApprovedOrOngoing,
                "The order cannot be canceled at this point"
            );
        }

        return Ok();
    }

    [HttpPost("{orderId}/extend")]
    public async Task<ActionResult> ExtendOrder(string orderId, [FromBody] ExtendOrderRequest extendOrder)
    {
        var order = await _db.Orders
            .OfType<Order>()
            .Include(e => e.Scooter)
            .Include(e => e.Extends)
            .Where(e => e.OrderId == orderId)
            .FirstOrDefaultAsync();
        
        var hireOption = await _db.HireOptions
            .Where(e => e.HireOptionId == extendOrder.HireOptionId)
            .FirstOrDefaultAsync();
        
        if (order is null)
        {
            return ApplicationError(
                ApplicationErrorCode.InvalidEntity, 
                "Order is invalid", 
                "order"
            );
        }

        if (hireOption is null)
        {
            return ApplicationError(
                ApplicationErrorCode.InvalidEntity, 
                "Hire option is not available", 
                "hireOption"
            );
        }

        try
        {
            var extension = await _inertia.ExtendOrder(
                order,
                hireOption
            );
            return Ok(extension);
        }
        catch (OrderCannotBeExtendException)
        {
            return ApplicationError(
                ApplicationErrorCode.OrderApprovedOrOngoing, 
                "Order cannot be extended at this point"
            );

        }
        catch (UnavailableScooterException)
        {
            return ApplicationError(ApplicationErrorCode.ScooterUnavailable, "The Scooter is not available");
        }
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