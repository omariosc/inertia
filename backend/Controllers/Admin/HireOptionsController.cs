using inertia.Authorization;
using inertia.Dtos;
using inertia.Enums;
using inertia.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace inertia.Controllers.Admin;

[ApiController]
[Authorize(Policy = Policies.Employee)]
[Route("api/admin/[controller]")]
[Produces("application/json")]
public class HireOptionsController: MyControllerBase
{
    private readonly InertiaContext _db;

    HireOptionsController(InertiaContext db)
    {
        _db = db;
    }

    [HttpGet()]
    public async Task<ActionResult> List()
    {
        return Ok(await _db.HireOptions.ToListAsync());
    }

    [HttpGet("{hireOptionId}")]
    public async Task<ActionResult> Get(int hireOptionId)
    {
        var hireOption = await _db.HireOptions
            .Where(h => h.HireOptionId == hireOptionId)
            .FirstOrDefaultAsync();

        if (hireOption is null)
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "invalid hire option", "hireOption");

        return Ok(hireOption);
    }
    
    [HttpPost()]
    public async Task<ActionResult> Create([FromBody] CreateHireOptionRequest request)
    {
        await _db.HireOptions.AddAsync(new HireOption
        {
            Name = request.Name,
            Cost = request.Cost,
            DurationInHours = request.DurationInHours
        });

        await _db.SaveChangesAsync();
        
        return Ok();
    }

    [HttpPatch("{hireOptionId}")]
    public async Task<ActionResult> Edit(int hireOptionId, [FromBody] PatchHireOptionRequest request)
    {
        var hireOption = await _db.HireOptions
            .Where(h => h.HireOptionId == hireOptionId)
            .FirstOrDefaultAsync();

        if (hireOption is null)
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "invalid hire option", "hireOption");

        hireOption.Cost = request.Cost ?? hireOption.Cost;
        hireOption.Name = request.Name ?? hireOption.Name;
        hireOption.DurationInHours = request.DurationInHours ?? hireOption.DurationInHours;

        await _db.SaveChangesAsync();
        
        return Ok();
    }

    [HttpDelete("{hireOptionId}")]
    public async Task<ActionResult> Remove(int hireOptionId)
    {
        var hireOption = await _db.HireOptions
            .Where(h => h.HireOptionId == hireOptionId)
            .FirstOrDefaultAsync();

        if (hireOption is null)
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "invalid hire option", "hireOption");

        _db.HireOptions.Remove(hireOption);
        await _db.SaveChangesAsync();
        
        return Ok();
    }


}