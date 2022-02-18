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
    public IEnumerable<Scooter> List()
    {
        return db.Scooters.Include(s => s.Depo).ToList();
    }
    
    [HttpGet("{id:int}")]
    public ActionResult<Scooter> GetItem(int id)
    {
        var scooter = db.Scooters.Include(s => s.Depo).FirstOrDefault(e => e.ScooterId == id);
        
        if (scooter == null)
            return NotFound();
        
        return Ok(scooter);
    }

    [HttpPost]
    public Scooter AddItem(
        [FromBody] CreateScooterRequest scooter 
    )
    {
        var e = db.Scooters.Add(new Scooter {
            DepoId = scooter.DepoId,
            Available = scooter.Available
        }).Entity;

        db.SaveChanges();
        
        return e;
    }

    [HttpDelete("{id:int}")]
    public ActionResult RemoveItem(int id)
    {
        var scooter = db.Scooters.Find(id);

        if (scooter == null)
            return UnprocessableEntity();

        db.Scooters.Remove(scooter);
        db.SaveChanges();
        return Ok();
    }

    [HttpPatch("{id:int}")]
    public ActionResult<Scooter> UpdateItem(int id, [FromBody] PatchScooterRequest scooterRequest)
    {
        var scooter = db.Scooters.Find(id);

        if (scooter == null)
            return UnprocessableEntity();

        scooter.DepoId = scooterRequest.DepoId ?? scooter.DepoId;
        scooter.Available = scooterRequest.Available ?? scooter.Available;

        db.SaveChanges();
        return Ok(scooter);
    }

}