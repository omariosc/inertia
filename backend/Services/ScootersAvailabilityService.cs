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
                    e.StartTime < endTime && e.EndTime > startTime &&
                    e.OrderState != OrderState.Cancelled
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
                    e.StartTime < endTime && e.EndTime > startTime &&
                    e.OrderState != OrderState.Cancelled
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
                    e.StartTime < endTime && e.EndTime > startTime &&
                    e.OrderState != OrderState.Cancelled &&
                    e.ScooterId == scooter.ScooterId
            )
            .FirstOrDefaultAsync();

        return clashingOrder == null;
    }
}