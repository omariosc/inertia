using inertia.Authorization;
using inertia.Dtos;
using inertia.Enums;
using Microsoft.AspNetCore.Mvc;

using inertia.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace inertia.Controllers.Admin;

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
    
    [HttpPost]
    public async Task<Depo> AddItem(
        [FromBody] Dtos.CreateDepoRequest depo 
    )
    {
        var e = await db.Depos.AddAsync(new Depo {
            Latitude = depo.Latitude,
            Longitude = depo.Longitude,
            Name = depo.Name
        });

        await db.SaveChangesAsync();
        
        return e.Entity;
    }

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
            Name = depoRequest.Name ?? oldDepo.Name
        };
        
        await db.Depos.AddAsync(depo);
        await db.SaveChangesAsync();
        
        return Ok(depo);
    }
}