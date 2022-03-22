using Microsoft.AspNetCore.Mvc;

using inertia.Models;
using inertia.Enums;
using inertia.Dtos;
using inertia.Services;
using Microsoft.EntityFrameworkCore;

namespace inertia.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class ScootersController: MyControllerBase
{
    private readonly InertiaContext _db;
    private readonly InertiaService _service;
    
    public ScootersController(InertiaContext db, InertiaService service)
    {
        _db = db;
        _service = service;
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
                return ApplicationError(ApplicationErrorCode.InvalidEntity, "depo id invalid", "depo");
            
            return Ok(await _service.GetAvailableScooters(
                depo,
                startTime.Value,
                endTime
            ));
        }
        else
        {
            return Ok(await _service.GetAvailableScooters(
                startTime.Value,
                endTime.Value
            )); 
        }
    }
    
    [HttpGet("count")]
    public async Task<ActionResult> CountAvailableScooters(
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

            int available = (await _service.GetAvailableScooters(
                depo,
                startTime.Value,
                endTime
            )).Count();
            int all = await _db.Scooters
                .Where(s => s.DepoId == depo.DepoId)
                .CountAsync();

            return Ok(new CountResponse(available, all));
        }
        else
        {
            int available = (await _service.GetAvailableScooters(
                startTime.Value,
                endTime.Value
            )).Count();

            int all = await _db.Scooters.CountAsync();
            
            return Ok(new CountResponse(available, all));
        }
    }
    
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Scooter>> GetItem(int id)
    {
        var scooter = await _db.Scooters
            .Include(s => s.Depo)
            .FirstOrDefaultAsync(e => e.ScooterId == id);
        
        if (scooter == null)
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "scooter id invalid", "scooter");
        
        return Ok(scooter);
    }
}