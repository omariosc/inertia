using EntityFramework.Exceptions.Common;
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
[Route("api/admin/[controller]")]
[Produces("application/json")]
[Consumes("application/json")]
[Authorize(Policy = Policies.Employee)]
public class ScootersController : MyControllerBase
{
    private readonly InertiaContext _db;
    private readonly InertiaService _inertia;

    public ScootersController(InertiaContext db, InertiaService inertia)
    {
        _db = db;
        _inertia = inertia;
    }

    [HttpGet]
    public async Task<ActionResult> List()
    {
        return Ok(await _inertia.GetAllScootersCurrentStatus());
    }

    [HttpPost("{scooterId:int}/return")]
    public async Task<ActionResult> ReturnScooter(int scooterId)
    {
        var scooter = await _db.Scooters
            .Where(s => s.ScooterId == scooterId)
            .FirstOrDefaultAsync();

        if (scooter is null)
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "invalid scooter id", "scooter");

        await _inertia.ReturnScooter(scooter);

        return Ok();
    }
    
    
    [HttpPost]
    public async Task<ActionResult> AddItem(
        [FromBody] CreateScooterRequest request 
    )
    {
        try
        {
            var scooter = new Scooter
            {
                DepoId = request.DepoId,
                SoftScooterId = request.SoftScooterId,
                Available = request.Available,
                Name = request.Name
            };
            await _db.Scooters.AddAsync(scooter);
            await _db.SaveChangesAsync();

            return Ok(scooter);
        }
        catch (UniqueConstraintException)
        {
            return ApplicationError(ApplicationErrorCode.ScooterIdTaken, "scooter id taken");
        }
    }

    [HttpDelete("{scooterId:int}")]
    public async Task<ActionResult> RemoveItem(int scooterId)
    {
        var scooter = await _db.Scooters
            .Where(s => s.ScooterId == scooterId)
            .FirstOrDefaultAsync();

        if (scooter == null)
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "scooter id invalid", "scooter");

        _db.Scooters.Remove(scooter);
        await _db.SaveChangesAsync();
        return Ok();
    }

    [HttpPatch("{scooterId:int}")]
    public async Task<ActionResult<Scooter>> UpdateItem(int scooterId, [FromBody] PatchScooterRequest scooterRequest)
    {
        var scooter = await _db.Scooters
            .Where(s => s.ScooterId == scooterId)
            .FirstOrDefaultAsync();

        if (scooter == null)
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "scooter id invalid", "scooter");

        try
        {
            scooter.Available = scooterRequest.Available ?? scooter.Available;
            scooter.DepoId = scooterRequest.DepoId ?? scooter.DepoId;
            scooter.Name = scooterRequest.Name ?? scooter.Name;
            scooter.SoftScooterId = scooterRequest.SoftScooterId ?? scooter.SoftScooterId;

            await _db.SaveChangesAsync();
        }
        catch (UniqueConstraintException)
        {
            return ApplicationError(ApplicationErrorCode.ScooterIdTaken, "scooter id taken");
        }
        
        return Ok(scooter);
    }
}