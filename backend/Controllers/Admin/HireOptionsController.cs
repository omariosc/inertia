using inertia.Authorization;
using inertia.Dtos;
using inertia.Enums;
using inertia.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace inertia.Controllers.Admin;

/// <summary>
/// Admin Controller that creates, modifies and removes hire options.
/// </summary>
[ApiController]
[Authorize(Policy = Policies.Employee)]
[Route("api/admin/[controller]")]
[Produces("application/json")]
public class HireOptionsController: MyControllerBase
{
    private readonly InertiaContext _db;

    public HireOptionsController(InertiaContext db)
    {
        _db = db;
    }

    /// <summary>
    /// lists all hire options
    /// </summary>
    /// <returns></returns>
    [HttpGet()]
    public async Task<ActionResult> List()
    {
        return Ok(await _db.HireOptions.ToListAsync());
    }

    /// <summary>
    /// searches for a hire option, by id
    /// </summary>
    /// <param name="hireOptionId"></param>
    /// <returns></returns>
    [HttpGet("{hireOptionId}")]
    [ProducesResponseType(typeof(ApplicationError), 422)]
    [ProducesResponseType(typeof(HireOption), 200)]
    public async Task<ActionResult> Get(int hireOptionId)
    {
        var hireOption = await _db.HireOptions
            .Where(h => h.HireOptionId == hireOptionId)
            .FirstOrDefaultAsync();

        if (hireOption is null)
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "invalid hire option", "hireOption");

        return Ok(hireOption);
    }
    
    /// <summary>
    /// creates a hire option
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
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
    
    /// <summary>
    /// modifies a hire option, by id
    /// </summary>
    /// <param name="hireOptionId"></param>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPatch("{hireOptionId}")]
    [ProducesResponseType(typeof(ApplicationError), 422)]
    [ProducesResponseType(typeof(HireOption), 200)]
    public async Task<ActionResult> Edit(int hireOptionId, [FromBody] PatchHireOptionRequest request)
    {
        var oldHireOption = await _db.HireOptions
            .Where(h => h.HireOptionId == hireOptionId)
            .FirstOrDefaultAsync();

        if (oldHireOption is null)
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "invalid hire option", "hireOption");

        oldHireOption.SoftDeleted = true;
        
        var hireOption = new HireOption
        {
            Cost = request.Cost ?? oldHireOption.Cost,
            Name = request.Name ?? oldHireOption.Name,
            DurationInHours = request.DurationInHours ?? oldHireOption.DurationInHours
        };

        await _db.HireOptions.AddAsync(hireOption);
        await _db.SaveChangesAsync();
        
        return Ok(hireOption);
    }

    /// <summary>
    /// removes a hire option, by id.
    /// </summary>
    /// <param name="hireOptionId"></param>
    /// <returns></returns>
    [HttpDelete("{hireOptionId}")]
    [ProducesResponseType(typeof(ApplicationError), 422)]
    [ProducesResponseType(typeof(void), 200)]
    public async Task<ActionResult> Remove(int hireOptionId)
    {
        var hireOption = await _db.HireOptions
            .Where(h => h.HireOptionId == hireOptionId)
            .FirstOrDefaultAsync();

        if (hireOption is null)
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "invalid hire option", "hireOption");

        hireOption.SoftDeleted = true;
        await _db.SaveChangesAsync();
        
        return Ok();
    }


}