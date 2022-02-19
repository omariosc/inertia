using System.Runtime.Intrinsics.Arm;
using inertia.Dtos;
using Microsoft.AspNetCore.Mvc;

using inertia.Models;
using Microsoft.EntityFrameworkCore;

namespace inertia.Controllers;

[ApiController]
[Route("[controller]")]
[Produces("application/json")]
public class DeposController : ControllerBase
{
    private readonly InertiaContext db;

    public DeposController(InertiaContext db)
    {
        this.db = db;
    }

    [HttpGet]
    public async Task<IEnumerable<Depo>> List()
    {
        return await db.Depos.ToListAsync();
    }
    
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Depo>> GetItem(int id)
    {
        var depo = await db.Depos.FindAsync(id);

        if (depo == null)
            return NotFound();
        
        return depo;
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
    public async Task<ActionResult> RemoveItem(int id)
    {
        var depo = await db.Depos.FindAsync(id);

        if (depo == null)
            return UnprocessableEntity();

        db.Depos.Remove(depo);
        await db.SaveChangesAsync();
        return Ok();
    }

    [HttpPatch("{id:int}")]
    public async Task<ActionResult<Depo>> UpdateItem(int id, [FromBody] PatchDepoRequest depoRequest)
    {
        var depo = await db.Depos.FindAsync(id);

        if (depo == null)
            return UnprocessableEntity();

        depo.Name = depoRequest.Name ?? depo.Name;
        depo.Latitude = depoRequest.Latitude ?? depo.Latitude;
        depo.Longitude = depoRequest.Longitude ?? depo.Longitude;

        await db.SaveChangesAsync();
        return Ok(depo);
    }

    [HttpGet("{id:int}/Scooters")]
    public async Task<ActionResult<IEnumerable<Scooter>>> ListScooters(int id)
    {
        var depo = await db.Depos.FindAsync(id);

        if (depo == null)
            return UnprocessableEntity();

        return await db.Scooters.Where(e => e.DepoId == id).ToListAsync();
    }
    
    [HttpGet("{id:int}/Scooters/Count")]
    public async Task<ActionResult<CountResult>> CountScooters(int id)
    {
        var depo = await db.Depos.FindAsync(id);

        if (depo == null)
            return UnprocessableEntity();

        return Ok(new CountResult(Count: await db.Scooters.CountAsync(e => e.DepoId == id)));
    }
}