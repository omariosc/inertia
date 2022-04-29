using inertia.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace inertia.Controllers;

/// <summary>
/// Controller to check all the currently available hire options
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class HireOptionsController: Controller
{
    private readonly InertiaContext _db;

    public HireOptionsController(InertiaContext db)
    {
        _db = db;
    }

    /// <summary>
    /// Returns a list of all hire options, available for usage.
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    [ProducesResponseType(typeof(List<HireOption>), 200)]
    public async Task<ActionResult> List()
    {
        return Ok(await _db.HireOptions.ToListAsync());
    }
}