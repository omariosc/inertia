using System.Security.Claims;
using inertia.Authorization;
using inertia.Dtos;
using inertia.Enums;
using inertia.Models;
using inertia.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace inertia.Controllers;

[ApiController]
[Route("[controller]")]
[Produces("application/json")]
public class OrdersController : MyControllerBase
{
    private readonly InertiaContext _db;
    private readonly ScootersAvailabilityService _scootersAvailability;

    public OrdersController(InertiaContext db, ScootersAvailabilityService scootersAvailability)
    {
        _db = db;
        _scootersAvailability = scootersAvailability;
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

        DateTime startTime = createOrder.StartTime;
        DateTime endTime = createOrder.StartTime.AddHours(hireOption.DurationInHours);

        if (!await _scootersAvailability.IsScooterAvailable(scooter, startTime, endTime))
        {
            return ApplicationError(ApplicationErrorCode.ScooterUnavailable, "The Scooter is not available");
        }
        
        Order order = new Order {
                OrderId = await Nanoid.Nanoid.GenerateAsync(),
                Scooter = scooter,
                AccountId = User.FindFirstValue(ClaimTypes.PrimarySid),
                HireOption = hireOption,
                StartTime = startTime,
                EndTime = endTime,
                Cost = hireOption.Cost,
                OrderState = OrderState.PendingApproval
                
        };

        await _db.Orders.AddAsync(order);
        await _db.SaveChangesAsync();

        return Ok(order);
    }
    
    [HttpPost("{orderId}/cancel")]
    [Authorize(Policy = Policies.Authenticated)]
    public async Task<ActionResult> CancelOrder(string orderId)
    {
        var accountId = User.FindFirstValue(ClaimTypes.PrimarySid);

        var order = await _db.Orders
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

        if (order.OrderState != OrderState.PendingApproval)
        {
            return ApplicationError(
                ApplicationErrorCode.OrderApprovedOrOngoing,
                "The order cannot be canceled at this point"
            );
        }

        order.OrderState = OrderState.Cancelled;
        if (order.Extensions is not null)
        {
            foreach (var e in order.Extensions)
            {
                e.OrderState = OrderState.Cancelled;
            }
        }
        await _db.SaveChangesAsync();

        return Ok();
    }

    [HttpPost("{orderId}/extend")]
    public async Task<ActionResult> ExtendOrder(string orderId, [FromBody] ExtendOrderRequest extendOrder)
    {
        var accountId = User.FindFirstValue(ClaimTypes.PrimarySid);

        var order = await _db.Orders
            .Include(e => e.Scooter)
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

        if (order.OrderState != OrderState.Upcoming && order.OrderState != OrderState.PendingApproval &&
            order.OrderState != OrderState.Ongoing)
        {
            return ApplicationError(
                ApplicationErrorCode.OrderApprovedOrOngoing, 
                "Order cannot be extended at this point"
                );
        }

        DateTime startTime = order.EndTime;
        DateTime endTime = startTime.AddHours(hireOption.DurationInHours);
        
        
        if (!await _scootersAvailability.IsScooterAvailable(order.Scooter, startTime, endTime))
        {
            return UnprocessableEntity("scooter is not available");
        }
        
        Order extension = new Order {
            OrderId = await Nanoid.Nanoid.GenerateAsync(),
            Scooter = order.Scooter,
            AccountId = User.FindFirstValue(ClaimTypes.PrimarySid),
            HireOption = hireOption,
            StartTime = startTime,
            EndTime = endTime,
            Cost = hireOption.Cost,
            Extends = order,
            OrderState = OrderState.PendingApproval
        };

        await _db.Orders.AddAsync(extension);
        await _db.SaveChangesAsync();

        return Ok(extension);
    }
}