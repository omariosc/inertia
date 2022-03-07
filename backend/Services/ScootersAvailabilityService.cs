using System.Linq;
using inertia.Enums;
using inertia.Models;
using Microsoft.EntityFrameworkCore;

namespace inertia.Services;

public class ScootersAvailabilityService
{
    private readonly InertiaContext _db;

    public ScootersAvailabilityService(InertiaContext db)
    {
        _db = db;
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
                        e.StartTime < endTime && e.EndTime > startTime &&
                        e.OrderState != OrderState.Cancelled) ||
                    e.OrderState == OrderState.PendingReturn
                    
            )
            .Select(
                e => e.ScooterId
            );

        var availableScooters = await _db.Scooters.Where(
            scooter =>
                !unavailableScooters.Contains(scooter.ScooterId)
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
                        e.StartTime < endTime && e.EndTime > startTime &&
                        e.OrderState != OrderState.Cancelled) ||
                    e.OrderState == OrderState.PendingReturn
            )
            .Select(
                e => e.ScooterId
            );

        var availableScooters = await _db.Scooters.Where(
            scooter =>
                !unavailableScooters.Contains(scooter.ScooterId) &&
                scooter.DepoId == depo.DepoId
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
                    ((e.StartTime < endTime && e.EndTime > startTime &&
                      e.OrderState != OrderState.Cancelled) ||
                     e.OrderState == OrderState.PendingReturn)&&
                     e.ScooterId == scooter.ScooterId
            )
            .FirstOrDefaultAsync();

        return clashingOrder == null;
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
                      e.OrderState != OrderState.Cancelled) ||
                     (e.OrderState == OrderState.PendingReturn && e.OrderId != toExtend.OrderId))&&
                    e.ScooterId == scooter.ScooterId
            )
            .FirstOrDefaultAsync();

        return clashingOrder == null;
    }

    private async Task UpdateOrderStatus()
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
    }
}