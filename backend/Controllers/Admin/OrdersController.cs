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

/// <summary>
/// Admin controller for operating on orders.
/// </summary>
[ApiController]
[Route("api/admin/[controller]")]
[Produces("application/json")]
[Authorize(Policy = Policies.Employee)]
public class OrdersController : MyControllerBase
{
    private readonly InertiaContext _db;
    private readonly InertiaService _inertia;
    private readonly EmailService _email;
    private readonly UsersService _users;

    public OrdersController(InertiaContext db, InertiaService inertia, EmailService email, UsersService users)
    {
        _db = db;
        _inertia = inertia;
        _email = email;
        _users = users;
    }

    /// <summary>
    /// Returns a list of all the orders, by all users.
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    public async Task<ActionResult<List<Order>>> ListOrders()
    {
        await _inertia.UpdateOrderStatus();

        var list = await _db.Orders
            .Include(e => e.Scooter)
            .ThenInclude(s=>s.Depo)
            .Include(e => e.HireOption)
            .Include(e => e.Extensions)
            .Include(e=> e.Account)
            .Where(e => e.ExtendsId == null)
            .ToListAsync();
        return Ok(list);
    }
    
    /// <summary>
    /// gets all the details of an order, by id.
    /// </summary>
    /// <param name="orderId"></param>
    /// <returns></returns>
    [HttpGet("{orderId}")]
    [ProducesResponseType(typeof(ApplicationError), 422)]
    [ProducesResponseType(typeof(Order), 200)]
    public async Task<ActionResult> ListOrders(string orderId)
    {
        await _inertia.UpdateOrderStatus();

        var order = await _db.Orders
            .Include(e => e.Scooter)
            .ThenInclude(s=>s.Depo)
            .Include(e => e.HireOption)
            .Include(e => e.Extensions)
            .Include(e=> e.Account)
            .Where(e => e.ExtendsId == null && e.OrderId == orderId)
            .FirstOrDefaultAsync();

        if (order is null)
        {
            return ApplicationError(
                ApplicationErrorCode.InvalidEntity,
                "invalid order id",
                "order"
            );
        }
        
        return Ok(order);
    }
    
    /// <summary>
    /// Creates a guest order, used for employees creating guest orders
    /// </summary>
    /// <param name="createOrder"></param>
    /// <returns></returns>
    [HttpPost("CreateGuestOrder")]
    [ProducesResponseType(typeof(ApplicationError), 422)]
    [ProducesResponseType(typeof(Order), 200)]
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

        var account = await _db.Accounts
            .Where(a => a.Email == createOrder.Email)
            .FirstOrDefaultAsync();

        if (account != null && account.Role != AccountRole.Guest)
        {
            return ApplicationError(
                ApplicationErrorCode.CannotCreateGuestBookingForRegisteredUser,
                "email provided is associated with a non-guest account"
            );
        }

        if (account == null)
        {
            account = await _users.CreateAccount(
                createOrder.Email,
                "",
                createOrder.Name,
                UserType.Regular,
                AccountRole.Guest
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
            
            await _email.SendOrderConfirmation(createOrder.Email, order);

            return Ok(order);
        }
        catch (UnavailableScooterException)
        {
            return ApplicationError(ApplicationErrorCode.ScooterUnavailable, "The Scooter is not available");
        }
    }

    /// <summary>
    /// Cancels an order
    /// </summary>
    /// <param name="orderId"></param>
    /// <returns></returns>
    [HttpPost("{orderId}/cancel")]
    [ProducesResponseType(typeof(ApplicationError), 422)]
    [ProducesResponseType(typeof(void), 200)]
    public async Task<ActionResult> CancelOrder(string orderId)
    {
        var order = await _db.Orders
            .Include(e => e.Account)
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
        
        await _email.SendOrderCancellation(order.Account.Email, order);

        return Ok();
    }

    /// <summary>
    /// Extends an order
    /// </summary>
    /// <param name="orderId"></param>
    /// <param name="extendOrder"></param>
    /// <returns></returns>
    [HttpPost("{orderId}/extend")]
    [ProducesResponseType(typeof(ApplicationError), 422)]
    [ProducesResponseType(typeof(Order), 200)]
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

            var extension_ = await _db.Orders
                .Include(o => o.Account)
                .Include(o => o.Extends)
                .Where(o => o.OrderId == extension.OrderId)
                .FirstAsync();

            await _email.SendOrderExtension(extension_.Account.Email, extension_.Extends!);
            
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
    
    /// <summary>
    /// Approves an order
    /// </summary>
    /// <param name="orderId"></param>
    /// <returns></returns>
    [HttpPost("{orderId}/approve")]
    [ProducesResponseType(typeof(ApplicationError), 422)]
    [ProducesResponseType(typeof(void), 200)]
    public async Task<ActionResult> ApproveOrder(string orderId)
    {
        var order = await _db.Orders
            .Include(o => o.Account)
            .Where(o => o.OrderId == orderId)
            .FirstOrDefaultAsync();

        if (order is null)
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "order id invalid", "order");

        order.OrderState = OrderState.Upcoming;
        await _db.SaveChangesAsync();

        await _email.SendOrderApproval(order.Account.Email, order);
        
        return Ok();
    }

    /// <summary>
    /// Rejects an order
    /// </summary>
    /// <param name="orderId"></param>
    /// <returns></returns>
    [HttpPost("{orderId}/deny")]
    [ProducesResponseType(typeof(ApplicationError), 422)]
    [ProducesResponseType(typeof(void), 200)]
    public async Task<ActionResult> DenyOrder(string orderId)
    {
        var order = await _db.Orders
            .Include(o => o.Account)
            .Where(o => o.OrderId == orderId)
            .FirstOrDefaultAsync();

        if (order is null)
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "order id invalid", "order");
        
        order.OrderState = OrderState.Denied;
        await _db.SaveChangesAsync();

        await _email.SendOrderDenied(order.Account.Email, order);
        
        return Ok();
    }
    
}