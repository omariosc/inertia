using inertia.Enums;
using inertia.Exceptions;
using inertia.Models;
using Microsoft.EntityFrameworkCore;

namespace inertia.Services;

public class InertiaService
{
    private readonly InertiaContext _db;

    public InertiaService(InertiaContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<Scooter>> GetAllScootersCurrentStatus(Depo? depo = null)
    {
        await UpdateOrderStatus();

        var pendingReturns = await _db.Scooters
            .Join(
                _db.Orders.Where(o => o.OrderState == OrderState.PendingReturn),
                scooter => scooter.ScooterId, order => order.ScooterId,
                (s, o) => s.ScooterId)
            .ToListAsync();
        
        var ongoing = await _db.Scooters
            .Join(
                _db.Orders.Where(o => o.OrderState == OrderState.Ongoing),
                scooter => scooter.ScooterId, order => order.ScooterId,
                (s, o) => s.ScooterId)
            .ToListAsync();

        
        var scooters = depo is null ?
            await _db.Scooters.ToListAsync():
            await _db.Scooters.Where(s => s.DepoId == depo.DepoId).ToListAsync();

        foreach (var s in scooters)
        {
            if (ongoing.Contains(s.ScooterId))
                s.ScooterStatus = ScooterStatus.OngoingOrder;
            else if (pendingReturns.Contains(s.ScooterId))
                s.ScooterStatus = ScooterStatus.PendingReturn;
            else if (s.Available == false)
                s.ScooterStatus = ScooterStatus.UnavailableByStaff;
            else s.ScooterStatus = ScooterStatus.InDepo;
        }
        
        return scooters;
    }

    public async Task<IEnumerable<Scooter>> GetAvailableScooters(
            DateTime startTime,
            DateTime endTime
    )
    {
        await UpdateOrderStatus();
        
        var unavailableScooters = _db.Orders
            .Join(
                _db.Scooters,
                order => order.ScooterId,
                scooter => scooter.ScooterId,
                (order, scooter) => new
                {
                    scooter.ScooterId,
                    StartTime = order.StartTime,
                    order.EndTime,
                    scooter.DepoId,
                    order.OrderState
                })
            .Where(
                e =>
                    (
                        e.StartTime <= endTime && e.EndTime >= startTime &&
                        e.OrderState != OrderState.Cancelled && e.OrderState != OrderState.Completed) ||
                    e.OrderState == OrderState.PendingReturn
                    
            )
            .Select(
                e => e.ScooterId
            );

        var availableScooters = await _db.Scooters.Where(
            scooter =>
                !unavailableScooters.Contains(scooter.ScooterId) &&
                scooter.Available
        ).ToListAsync();

        return availableScooters;
    }
    
    public async Task<IEnumerable<Scooter>> GetAvailableScooters(
        Depo depo,
        DateTime startTime,
        DateTime? endTime = null
    )
    {
        await UpdateOrderStatus();
        
        endTime = endTime ?? startTime;

        var unavailableScooters = _db.Orders
            .Join(
                _db.Scooters,
                order => order.ScooterId,
                scooter => scooter.ScooterId,
                (order, scooter) => new
                {
                    ScooterId = scooter.ScooterId,
                    StartTime = order.StartTime,
                    EndTime = order.EndTime,
                    DepoId = scooter.DepoId,
                    OrderState = order.OrderState
                })
            .Where(
                e =>
                    (
                        e.StartTime <= endTime && e.EndTime >= startTime &&
                        e.OrderState != OrderState.Cancelled && e.OrderState != OrderState.Completed) ||
                    e.OrderState == OrderState.PendingReturn
            )
            .Select(
                e => e.ScooterId
            );

        var availableScooters = await _db.Scooters.Where(
            scooter =>
                !unavailableScooters.Contains(scooter.ScooterId) &&
                scooter.DepoId == depo.DepoId &&
                scooter.Available
        ).ToListAsync();

        return availableScooters;
    }

    public async Task<bool> IsScooterAvailable(
        Scooter scooter,
        DateTime startTime,
        DateTime? endTime = null)
    {
        await UpdateOrderStatus();
        
        endTime = endTime ?? startTime;

        var clashingOrder = await _db.Orders
            .Join(
                _db.Scooters,
                order => order.ScooterId,
                scooter => scooter.ScooterId,
                (order, scooter) => new
                {
                    ScooterId = scooter.ScooterId,
                    StartTime = order.StartTime,
                    EndTime = order.EndTime,
                    DepoId = scooter.DepoId,
                    OrderState = order.OrderState
                })
            .Where(
                e =>
                    ((e.StartTime <= endTime && e.EndTime >= startTime &&
                      e.OrderState != OrderState.Cancelled && e.OrderState != OrderState.Completed) ||
                     e.OrderState == OrderState.PendingReturn) &&
                     e.ScooterId == scooter.ScooterId
            )
            .FirstOrDefaultAsync();

        return clashingOrder == null && scooter.Available;
    }
    
    public async Task<bool> IsScooterAvailableForExtension(
        Order toExtend,
        Scooter scooter,
        DateTime startTime,
        DateTime? endTime = null)
    {
        await UpdateOrderStatus();
        
        endTime = endTime ?? startTime;

        var clashingOrder = await _db.Orders
            .Join(
                _db.Scooters,
                order => order.ScooterId,
                scooter => scooter.ScooterId,
                (order, scooter) => new
                {
                    OrderId = order.OrderId,
                    ScooterId = scooter.ScooterId,
                    StartTime = order.StartTime,
                    EndTime = order.EndTime,
                    DepoId = scooter.DepoId,
                    OrderState = order.OrderState
                })
            .Where(
                e =>
                    ((e.StartTime < endTime && e.EndTime > startTime &&
                      e.OrderState != OrderState.Cancelled && e.OrderState != OrderState.Completed) ||
                     (e.OrderState == OrderState.PendingReturn && e.OrderId != toExtend.OrderId))&&
                    e.ScooterId == scooter.ScooterId
            )
            .FirstOrDefaultAsync();

        return clashingOrder == null && scooter.Available;
    }

    public async Task ReturnScooter(Scooter scooter)
    {
        await UpdateOrderStatus();
        
        await _db.Orders
            .Where(o =>
                o.ScooterId == scooter.ScooterId &&
                (o.OrderState == OrderState.Ongoing || o.OrderState == OrderState.PendingReturn))
            .ForEachAsync(o =>
            {
                o.OrderState = OrderState.Completed;
            });
        await _db.SaveChangesAsync();
    }

    public async Task UpdateOrderStatus()
    {
        var upcomingOrders = await _db.Orders
            .Where(o =>
                o.StartTime <= DateTime.Now &&
                o.EndTime >= DateTime.Now &&
                o.OrderState == OrderState.Upcoming
            )
            .ToListAsync();

        foreach (var o in upcomingOrders)
        {
            o.OrderState = OrderState.Ongoing;
        }

        var pastOrders = await _db.Orders
            .Where(o =>
                o.EndTime <= DateTime.Now &&
                o.OrderState == OrderState.Ongoing)
            .ToListAsync();

        foreach (var o in pastOrders)
        {
            o.OrderState = OrderState.PendingReturn;
        }

        await _db.SaveChangesAsync();
    }

    public async Task<Order> CreateOrder(
        Account account,
        Scooter scooter, 
        HireOption hireOption,
        DateTime startTime)
    {
        DateTime endTime = startTime.AddHours(hireOption.DurationInHours);
        
        if (!await IsScooterAvailable(scooter, startTime, endTime))
        {
            throw new UnavailableScooterException();
        }

        float discount = account.UserType != UserType.Regular ? 10.0F / 100.0F : 0.0F;
        var cost = hireOption.Cost * (1 - discount);
        
        Order abstractOrder = new Order {
            OrderId = await Nanoid.Nanoid.GenerateAsync(),
            Scooter = scooter,
            Account = account,
            HireOption = hireOption,
            CreatedAt = DateTime.Now,
            StartTime = startTime,
            EndTime = endTime,
            PreDiscountCost = hireOption.Cost,
            Discount = discount,
            Cost = cost,
            OrderState = OrderState.PendingApproval
        };

        await _db.Orders.AddAsync(abstractOrder);
        await _db.SaveChangesAsync();

        return abstractOrder;
    }

    public async Task<Order> ExtendOrder(
        Order order,
        HireOption hireOption
        )
    {
        if (order.OrderState is OrderState.Completed or OrderState.Cancelled or OrderState.Denied)
            throw new OrderCannotBeExtendException();
        
        if (order.ExtendsId != null)
        {
            order = (await _db.Orders
                .Where(o => o.OrderId == order.ExtendsId)
                .FirstOrDefaultAsync())!;
        }
        
        await _db.Entry(order).Collection(o => o.Extensions ?? new List<Order>()).LoadAsync();

        DateTime startTime;
        DateTime endTime;
        
        if (order.Extensions!.Count == 0)
        {
            startTime = order.EndTime;
            endTime = order.EndTime.AddHours(hireOption.DurationInHours);
        }
        else
        {
            startTime = order.Extensions.OrderByDescending(o => o.EndTime).FirstOrDefault()!.EndTime;
            endTime = startTime.AddHours(hireOption.DurationInHours);

        }
        
        if (!await IsScooterAvailableForExtension(order, order.Scooter, startTime, endTime))
        {
            throw new UnavailableScooterException();
        }
        

        var discount = order.Discount;
        var cost = hireOption.Cost * (1.0F - discount);
        
        Order extension = new Order {
            OrderId = await Nanoid.Nanoid.GenerateAsync(),
            Scooter = order.Scooter,
            AccountId = order.AccountId,
            HireOption = hireOption,
            CreatedAt = DateTime.Now,
            StartTime = startTime,
            EndTime = endTime,
            PreDiscountCost = hireOption.Cost,
            Discount = discount,
            Cost = cost,
            Extends = order,
            OrderState = OrderState.PendingApproval
        };
        
        await _db.Orders.AddAsync(extension);
        await _db.SaveChangesAsync();
        
        return extension;
    }

    public async Task CancelOrder(Order order)
    {
        if (order.OrderState is OrderState.Completed or OrderState.Cancelled or OrderState.Denied)
            throw new OrderApprovedOrOngoingException();
        
        order.OrderState = OrderState.Cancelled;
        
        var extensions = await _db.Orders
            .Where(o => o.ExtendsId == order.OrderId)
            .ToListAsync();
        foreach (var o in extensions)
        {
            o.OrderState = OrderState.Cancelled;
        }

        await _db.SaveChangesAsync();
    }
}