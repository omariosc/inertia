using inertia.Dtos;
using inertia.Enums;
using Microsoft.AspNetCore.Mvc;
using inertia.Models;
using Microsoft.EntityFrameworkCore;

namespace inertia.Controllers;

/// <summary>
/// Depos controller, to list and search through depos.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class DeposController : MyControllerBase
{
    private readonly InertiaContext _db;

    public DeposController(InertiaContext db)
    {
        _db = db;
    }

    /// <summary>
    /// Lists all the depos
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    public async Task<IEnumerable<Depo>> List()
    {
        return await _db.Depos.ToListAsync();
    }
    
    /// <summary>
    /// Returns all the details of a depo, by id.
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ApplicationError), 422)]
    [ProducesResponseType(typeof(Depo), 200)]
    public async Task<ActionResult> GetItem(int id)
    {
        var depo = await _db.Depos.FindAsync(id);

        if (depo == null)
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "scooter id invalid", "scooter");
        
        return Ok(depo);
    }
}