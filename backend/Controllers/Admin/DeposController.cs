using inertia.Authorization;
using inertia.Dtos;
using inertia.Enums;
using Microsoft.AspNetCore.Mvc;

using inertia.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace inertia.Controllers.Admin;

/// <summary>
/// Admin controller for modifying, adding and removing depos.
/// </summary>
[ApiController]
[Route("api/admin/[controller]")]
[Produces("application/json")]
[Authorize(Policy = Policies.Employee)]
public class DeposController : MyControllerBase
{
    private readonly InertiaContext db;

    public DeposController(InertiaContext db)
    {
        this.db = db;
    }
    
    /// <summary>
    /// Endpoint that creates a new Depo
    /// </summary>
    /// <param name="depo"></param>
    /// <returns></returns>
    [HttpPost]
    public async Task<Depo> AddItem(
        [FromBody] Dtos.CreateDepoRequest depo 
    )
    {
        var e = await db.Depos.AddAsync(new Depo {
            Latitude = depo.Latitude,
            Longitude = depo.Longitude,
            Name = depo.Name,
            Address = depo.Address
        });

        await db.SaveChangesAsync();
        
        return e.Entity;
    }

    /// <summary>
    /// Endpoint that removes a depo.
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(typeof(ApplicationError), 422)]
    [ProducesResponseType(typeof(void), 200)]
    public async Task<ActionResult> RemoveItem(int id)
    {
        var depo = await db.Depos.FindAsync(id);

        if (depo == null)
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "depo id invalid", "depo");

        depo.SoftDeleted = true;
        await db.SaveChangesAsync();
        return Ok();
    }

    /// <summary>
    /// Endpoint that modifies a depo
    /// </summary>
    /// <param name="id"></param>
    /// <param name="depoRequest"></param>
    /// <returns></returns>
    [HttpPatch("{id:int}")]
    [ProducesResponseType(typeof(ApplicationError), 422)]
    [ProducesResponseType(typeof(Depo), 200)]
    public async Task<ActionResult> UpdateItem(int id, [FromBody] PatchDepoRequest depoRequest)
    {
        var oldDepo = await db.Depos.FindAsync(id);

        if (oldDepo == null)
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "depo id invalid", "depo");

        oldDepo.SoftDeleted = true;

        var depo = new Depo
        {
            Latitude = depoRequest.Latitude ?? oldDepo.Latitude,
            Longitude = depoRequest.Longitude ?? oldDepo.Longitude,
            Name = depoRequest.Name ?? oldDepo.Name,
            Address = depoRequest.Address ?? oldDepo.Address
        };
        
        await db.Depos.AddAsync(depo);
        await db.SaveChangesAsync();
        
        return Ok(depo);
    }
}