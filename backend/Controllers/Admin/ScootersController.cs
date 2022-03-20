using inertia.Authorization;
using inertia.Dtos;
using inertia.Enums;
using inertia.Models;
using inertia.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace inertia.Controllers.Admin;

[ApiController]
[Route("admin/[controller]")]
[Produces("application/json")]
[Consumes("application/json")]
public class ScootersController : MyControllerBase
{
    private readonly InertiaContext _db;
    private readonly ScootersService _scooters;

    public ScootersController(InertiaContext db, ScootersService scooters)
    {
        _db = db;
        _scooters = scooters;
    }

    [HttpGet]
    [Authorize(Policy = Policies.Staff)]
    public async Task<ActionResult> List()
    {
        return Ok(await _scooters.GetAllScootersCurrentStatus());
    }

    [HttpPost("{scooterId:int}/return")]
    [Authorize(Policy = Policies.Staff)]
    public async Task<ActionResult> ReturnScooter(int scooterId)
    {
        var scooter = await _db.Scooters
            .Where(s => s.ScooterId == scooterId)
            .FirstOrDefaultAsync();

        if (scooter is null)
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "invalid scooter id", "scooter");

        await _scooters.ReturnScooter(scooter);

        return Ok();
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
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "scooter id invalid", "scooter");

        _db.Scooters.Remove(scooter);
        await _db.SaveChangesAsync();
        return Ok();
    }

    [HttpPatch("{id:int}")]
    public async Task<ActionResult<Scooter>> UpdateItem(int id, [FromBody] PatchScooterRequest scooterRequest)
    {
        var scooter = await _db.Scooters.FindAsync(id);

        if (scooter == null)
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "scooter id invalid", "scooter");

        scooter.DepoId = scooterRequest.DepoId ?? scooter.DepoId;

        await _db.SaveChangesAsync();
        return Ok(scooter);
    }
}