using System.Security.Claims;
using inertia.Authorization;
using inertia.Dtos;
using inertia.Enums;
using inertia.Exceptions;
using inertia.Models;
using inertia.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace inertia.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class OrdersController : MyControllerBase
{
    private readonly InertiaContext _db;
    private readonly InertiaService _inertia;
    private readonly EmailService _email;

    public OrdersController(InertiaContext db, InertiaService inertia, EmailService email)
    {
        _db = db;
        _inertia = inertia;
        _email = email;
    }

    [HttpGet("{orderId}")]
    [Authorize(Policy = Policies.Authenticated)]
    public async Task<ActionResult> GetOrder(string orderId)
    {
        var accountId = User.FindFirstValue(ClaimTypes.PrimarySid);
        var order = await _db.Orders
            .OfType<Order>()
            .Include(o => o.Extensions)
            .Include(o => o.HireOption)
            .Where(o => o.OrderId == orderId)
            .FirstOrDefaultAsync();

        if (order == null)
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "invalid order id", "order");

        if (order.AccountId != accountId)
            return Forbid();

        return Ok(order);
    }
    
    [HttpPost]
    [Authorize(Policy = Policies.Authenticated)]
    public async Task<ActionResult> CreateOrder([FromBody] CreateOrderRequest createOrder)
    {
        var scooter = await _db.Scooters
            .Where(e => e.ScooterId == createOrder.ScooterId)
            .FirstOrDefaultAsync();

        var hireOption = await _db.HireOptions
            .Where(e => e.HireOptionId == createOrder.HireOptionId)
            .FirstOrDefaultAsync();

        var account = (await _db.Accounts
            .Where(e => e.AccountId == User.FindFirstValue(ClaimTypes.PrimarySid))
            .FirstOrDefaultAsync())!;
        
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
            var order = await _inertia.CreateOrder(
                account,
                scooter,
                hireOption,
                createOrder.StartTime
            );

            await _email.SendBookingOrderConfirmation(account.Email, order);
            
            return Ok(order);
        }
        catch (UnavailableScooterException)
        {
            return ApplicationError(ApplicationErrorCode.ScooterUnavailable, "The Scooter is not available");
        }
    }
    
    [HttpPost("{orderId}/cancel")]
    [Authorize(Policy = Policies.Authenticated)]
    public async Task<ActionResult> CancelOrder(string orderId)
    {
        var accountId = User.FindFirstValue(ClaimTypes.PrimarySid);

        var order = await _db.Orders
            .OfType<Order>()
            .Include(e => e.Extensions)   
            .Where(e => e.OrderId == orderId && e.AccountId == accountId)
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
    [Authorize(Policy = Policies.Authenticated)]
    public async Task<ActionResult> ExtendOrder(string orderId, [FromBody] ExtendOrderRequest extendOrder)
    {
        var accountId = User.FindFirstValue(ClaimTypes.PrimarySid);

        var order = await _db.Orders
            .OfType<Order>()
            .Include(e => e.Scooter)
            .Include(e => e.Extends)
            .Where(e => e.OrderId == orderId && e.AccountId == accountId)
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
}