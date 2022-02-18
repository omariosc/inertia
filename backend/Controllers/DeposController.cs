using inertia.Dtos;
using Microsoft.AspNetCore.Mvc;

using inertia.Models;

namespace inertia.Controllers;

[ApiController]
[Route("[controller]")]
public class DeposController : ControllerBase
{
    private readonly InertiaContext db;

    public DeposController(InertiaContext db)
    {
        this.db = db;
    }

    [HttpGet]
    public IEnumerable<Depo> List()
    {
        return db.Depos;
    }
    
    [HttpGet("{id:int}")]
    public ActionResult<Depo> GetItem(int id)
    {
        var depo = db.Depos.Find(id);

        if (depo == null)
            return NotFound();
        
        return depo;
    }

    [HttpPost]
    public Depo AddItem(
        [FromBody] Dtos.CreateDepoRequest depo 
    )
    {
        var e = db.Depos.Add(new Depo {
            Latitude = depo.Latitude,
            Longitude = depo.Longitude,
            Name = depo.Name
        }).Entity;

        db.SaveChanges();
        
        return e;
    }

    [HttpDelete("{id:int}")]
    public ActionResult RemoveItem(int id)
    {
        var depo = db.Depos.Find(id);

        if (depo == null)
            return UnprocessableEntity();

        db.Depos.Remove(depo);
        db.SaveChanges();
        return Ok();
    }

    [HttpPatch("{id:int}")]
    public ActionResult<Depo> UpdateItem(int id, [FromBody] PatchDepoRequest depoRequest)
    {
        var depo = db.Depos.Find(id);

        if (depo == null)
            return UnprocessableEntity();

        depo.Name = depoRequest.Name ?? depo.Name;
        depo.Latitude = depoRequest.Latitude ?? depo.Latitude;
        depo.Longitude = depoRequest.Longitude ?? depo.Longitude;

        db.SaveChanges();
        return Ok(depo);
    }
    
}