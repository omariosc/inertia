using System.Runtime.Intrinsics.Arm;
using inertia.Dtos;
using Microsoft.AspNetCore.Mvc;

using inertia.Models;
using inertia.Services;
using Microsoft.EntityFrameworkCore;

namespace inertia.Controllers;

[ApiController]
[Route("[controller]")]
[Produces("application/json")]
public class DeposController : ControllerBase
{
    private readonly InertiaContext _db;

    public DeposController(InertiaContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IEnumerable<Depo>> List()
    {
        return await _db.Depos.ToListAsync();
    }
    
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Depo>> GetItem(int id)
    {
        var depo = await _db.Depos.FindAsync(id);

        if (depo == null)
            return NotFound();
        
        return depo;
    }
}