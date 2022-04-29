using inertia.Dtos;
using inertia.Enums;
using inertia.Models;
using inertia.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimeKit;

namespace inertia.Controllers.Admin;


/// <summary>
/// Admin controller that implements approving and denying discount applications
/// </summary>
[ApiController]
[Route("api/admin/[controller]")]
[Produces("application/json")]
[Consumes("application/json")]
public class DiscountApplicationsController : MyControllerBase
{
    private readonly InertiaContext _db;
    private readonly EmailService _email;

    public DiscountApplicationsController(InertiaContext db, EmailService email)
    {
        _db = db;
        _email = email;
    }

    /// <summary>
    /// Fetches a list of the current discount applications
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    public async Task<ActionResult> List()
    {
        var applications = await _db.DiscountApplications
            .Include(a => a.Account)
            .Where(a => a.State == DiscountApplicationState.Pending)
            .ToListAsync();

        return Ok(applications);
    }

    /// <summary>
    /// Fetches the image of a discount application, by id.
    /// </summary>
    /// <param name="applicationId"></param>
    /// <returns></returns>
    [HttpGet("{applicationId:int}/Image")]
    [ProducesResponseType(typeof(ApplicationError), 422)]
    public async Task<ActionResult> GetImage(int applicationId)
    {
        var application = await _db.DiscountApplications
            .Where(a => a.DiscountApplicationId == applicationId)
            .FirstOrDefaultAsync();

        if (application is not {State: DiscountApplicationState.Pending})
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "invalid discount application id",
                "discountApplication");

        return File(application.Image!, "application/octet-stream");
    }

    /// <summary>
    /// Approved a discount application, by id.
    /// </summary>
    /// <param name="applicationId"></param>
    /// <returns></returns>
    [HttpPost("{applicationId:int}/Approve")]
    [ProducesResponseType(typeof(ApplicationError), 422)]
    [ProducesResponseType(typeof(void), 200)]
    public async Task<ActionResult> Approve(int applicationId)
    {
        var application = await _db.DiscountApplications
            .Include(a => a.Account)
            .Where(a => a.DiscountApplicationId == applicationId && a.State == DiscountApplicationState.Pending)
            .FirstOrDefaultAsync();
        
        if (application is not {State: DiscountApplicationState.Pending})
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "invalid discount application id",
                "discountApplication");

        application.State = DiscountApplicationState.Approved;
        application.Account.UserType = application.DisccountType;
        await _db.SaveChangesAsync();

        await _email.SendDiscountApplication(application.Account.Email, application.Account);

        return Ok();
    }

    /// <summary>
    /// Rejects a discount application by id.
    /// </summary>
    /// <param name="applicationId"></param>
    /// <returns></returns>
    [HttpPost("{applicationId:int}/Deny")]
    [ProducesResponseType(typeof(ApplicationError), 422)]
    [ProducesResponseType(typeof(void), 200)]
    public async Task<ActionResult> Deny(int applicationId)
    {
        var application = await _db.DiscountApplications
            .Include(a => a.Account)
            .Where(a => a.DiscountApplicationId == applicationId && a.State == DiscountApplicationState.Pending)
            .FirstOrDefaultAsync();
        
        if (application is not {State: DiscountApplicationState.Pending})
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "invalid discount application id",
                "discountApplication");

        application.State = DiscountApplicationState.Denied;
        await _db.SaveChangesAsync();

        return Ok();
    }
}