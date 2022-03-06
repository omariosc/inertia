using Microsoft.AspNetCore.Mvc;

using inertia.Models;
using inertia.Enums;
using inertia.Dtos;
using inertia.Services;
using Microsoft.EntityFrameworkCore;

namespace inertia.Controllers;

[ApiController]
[Route("[controller]")]
[Produces("application/json")]
public class ScootersController: Controller
{
    private readonly InertiaContext _db;
    private readonly ScootersAvailabilityService _availabilityService;
    
    public ScootersController(InertiaContext db, ScootersAvailabilityService availabilityService)
    {
        _db = db;
        _availabilityService = availabilityService;
    }

    [HttpGet]
    public async Task<IEnumerable<Scooter>> List()
    {
        return await _db.Scooters.Include(s => s.Depo).ToListAsync();
    }
    
    [HttpGet("available")]
    public async Task<ActionResult> GetAvailableScooters(
        [FromQuery(Name = "depoId")] int? depoId,
        [FromQuery(Name = "startTime")] DateTime? startTime,
        [FromQuery(Name = "endTime")] DateTime? endTime
    )
    {
        startTime ??= DateTime.Now;
        endTime ??= startTime;
        
        if (depoId.HasValue)
        {
            var depo = await _db.Depos
                .Where(e => e.DepoId == depoId)
                .FirstOrDefaultAsync();

            if (depo == null)
                return UnprocessableEntity();
            
            return Ok(await _availabilityService.GetAvailableScooters(
                depo,
                startTime.Value,
                endTime
            ));
        }
        else
        {
            return Ok(await _availabilityService.GetAvailableScooters(
                startTime.Value,
                endTime.Value
            )); 
        }
    }
    
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Scooter>> GetItem(int id)
    {
        var scooter = await _db.Scooters
            .Include(s => s.Depo)
            .FirstOrDefaultAsync(e => e.ScooterId == id);
        
        if (scooter == null)
            return NotFound();
        
        return Ok(scooter);
    }

    [HttpPost]
    public async Task<Scooter> AddItem(
        [FromBody] CreateScooterRequest scooter 
    )
    {
        var e = await _db.Scooters.AddAsync(new Scooter {
            DepoId = scooter.DepoId,
        });

        await _db.SaveChangesAsync();
        
        return e.Entity;
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> RemoveItem(int id)
    {
        var scooter = await _db.Scooters.FindAsync(id);

        if (scooter == null)
            return UnprocessableEntity();

        _db.Scooters.Remove(scooter);
        await _db.SaveChangesAsync();
        return Ok();
    }

    [HttpPatch("{id:int}")]
    public async Task<ActionResult<Scooter>> UpdateItem(int id, [FromBody] PatchScooterRequest scooterRequest)
    {
        var scooter = await _db.Scooters.FindAsync(id);

        if (scooter == null)
            return UnprocessableEntity();

        scooter.DepoId = scooterRequest.DepoId ?? scooter.DepoId;

        await _db.SaveChangesAsync();
        return Ok(scooter);
    }

}