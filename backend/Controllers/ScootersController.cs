using Microsoft.AspNetCore.Mvc;

using inertia.Models;
using inertia.Dtos;
using Microsoft.EntityFrameworkCore;

namespace inertia.Controllers;

[ApiController]
[Route("[controller]")]
[Produces("application/json")]
public class ScootersController: Controller
{
    private readonly InertiaContext db;
    
    public ScootersController(InertiaContext db)
    {
        this.db = db;
    }

    [HttpGet]
    public async Task<IEnumerable<Scooter>> List()
    {
        return await db.Scooters.Include(s => s.Depo).ToListAsync();
    }
    
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Scooter>> GetItem(int id)
    {
        var scooter = await db.Scooters
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
        var e = await db.Scooters.AddAsync(new Scooter {
            DepoId = scooter.DepoId,
            Available = scooter.Available
        });

        await db.SaveChangesAsync();
        
        return e.Entity;
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> RemoveItem(int id)
    {
        var scooter = await db.Scooters.FindAsync(id);

        if (scooter == null)
            return UnprocessableEntity();

        db.Scooters.Remove(scooter);
        await db.SaveChangesAsync();
        return Ok();
    }

    [HttpPatch("{id:int}")]
    public async Task<ActionResult<Scooter>> UpdateItem(int id, [FromBody] PatchScooterRequest scooterRequest)
    {
        var scooter = await db.Scooters.FindAsync(id);

        if (scooter == null)
            return UnprocessableEntity();

        scooter.DepoId = scooterRequest.DepoId ?? scooter.DepoId;
        scooter.Available = scooterRequest.Available ?? scooter.Available;

        await db.SaveChangesAsync();
        return Ok(scooter);
    }

}