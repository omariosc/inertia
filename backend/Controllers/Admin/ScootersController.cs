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

/// <summary>
/// Admin Controller for handling scooters.
/// </summary>
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

    /// <summary>
    /// Get a list of all scooters, with their updated status.
    /// </summary>
    /// <param name="depoId"></param>
    /// <param name="status"></param>
    /// <returns></returns>
    [HttpGet]
    [ProducesResponseType(typeof(List<Scooter>), 200)]
    public async Task<ActionResult> List([FromQuery] int? depoId, [FromQuery] ScooterStatus? status)
    {
        var scooters = await _inertia.GetAllScootersCurrentStatus();

        if (depoId is not null)
            scooters = scooters.Where(s => s.DepoId == depoId);

        if (status is not null)
            scooters = scooters.Where(s => s.ScooterStatus == status);
        
        return Ok(scooters);
    }

    /// <summary>
    /// Returns a scooter that is in the PendingReturn state.
    /// </summary>
    /// <param name="scooterId"></param>
    /// <returns></returns>
    [HttpPost("{scooterId:int}/return")]
    [ProducesResponseType(typeof(ApplicationError), 422)]
    [ProducesResponseType(typeof(void), 200)]
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
    
    /// <summary>
    /// Creates a new scooter
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPost]
    [ProducesResponseType(typeof(ApplicationError), 422)]
    [ProducesResponseType(typeof(Scooter), 200)]
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

    /// <summary>
    /// removes a scooter
    /// </summary>
    /// <param name="scooterId"></param>
    /// <returns></returns>
    [HttpDelete("{scooterId:int}")]
    [ProducesResponseType(typeof(ApplicationError), 422)]
    [ProducesResponseType(typeof(void), 200)]
    public async Task<ActionResult> RemoveItem(int scooterId)
    {
        var scooter = await _db.Scooters
            .Where(s => s.ScooterId == scooterId)
            .FirstOrDefaultAsync();

        if (scooter == null)
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "scooter id invalid", "scooter");

        scooter.SoftDeleted = true;
        await _db.SaveChangesAsync();
        
        return Ok();
    }

    /// <summary>
    /// updates the details of a scooter
    /// </summary>
    /// <param name="scooterId"></param>
    /// <param name="scooterRequest"></param>
    /// <returns></returns>
    [HttpPatch("{scooterId:int}")]
    [ProducesResponseType(typeof(ApplicationError), 422)]
    [ProducesResponseType(typeof(Scooter), 200)]
    public async Task<ActionResult<Scooter>> UpdateItem(int scooterId, [FromBody] PatchScooterRequest scooterRequest)
    {
        var oldScooter = await _db.Scooters
            .Where(s => s.ScooterId == scooterId)
            .FirstOrDefaultAsync();

        if (oldScooter == null)
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "scooter id invalid", "scooter");

        var clash = scooterRequest.SoftScooterId != null ? 
            await _db.Scooters.Where(s => s.SoftScooterId == scooterRequest.SoftScooterId).FirstOrDefaultAsync() 
            : null;

        if (clash == null || clash.ScooterId == oldScooter.ScooterId)
        {
            oldScooter.Available = scooterRequest.Available ?? oldScooter.Available;
            oldScooter.DepoId = scooterRequest.DepoId ?? oldScooter.DepoId;
            oldScooter.Name = scooterRequest.Name ?? oldScooter.Name;
            oldScooter.SoftScooterId = scooterRequest.SoftScooterId ?? oldScooter.SoftScooterId;

            await _db.SaveChangesAsync();
        }
        else
        {
            return ApplicationError(ApplicationErrorCode.ScooterIdTaken, "scooter id taken");
        }

        return Ok(oldScooter);
    }
}