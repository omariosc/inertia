using Microsoft.AspNetCore.Mvc;

using inertia.Models;
using inertia.Enums;
using inertia.Dtos;
using inertia.Services;
using Microsoft.EntityFrameworkCore;


namespace inertia.Controllers;

[ApiController]
[Route("[controller]")]
[Produces("application/json")]
public class HireOptionsController: Controller
{
    private readonly InertiaContext _db;

    public HireOptionsController(InertiaContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult> List()
    {
        return Ok(await _db.HireOptions.ToListAsync());
    }
}