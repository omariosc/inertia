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

        db.Depos.Remove(depo);
        await db.SaveChangesAsync();
        return Ok();
    }

    [HttpPatch("{id:int}")]
    [ProducesResponseType(typeof(ApplicationError), 422)]
    [ProducesResponseType(typeof(Depo), 200)]
    public async Task<ActionResult> UpdateItem(int id, [FromBody] PatchDepoRequest depoRequest)
    {
        var depo = await db.Depos.FindAsync(id);

        if (depo == null)
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "depo id invalid", "depo");

        depo.Name = depoRequest.Name ?? depo.Name;
        depo.Latitude = depoRequest.Latitude ?? depo.Latitude;
        depo.Longitude = depoRequest.Longitude ?? depo.Longitude;

        await db.SaveChangesAsync();
        return Ok(depo);
    }
}