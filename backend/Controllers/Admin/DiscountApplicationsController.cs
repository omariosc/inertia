using inertia.Enums;
using inertia.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimeKit;

namespace inertia.Controllers.Admin;

[ApiController]
[Route("api/admin/[controller]")]
[Produces("application/json")]
[Consumes("application/json")]
public class DiscountApplicationsController : MyControllerBase
{
    private readonly InertiaContext _db;

    public DiscountApplicationsController(InertiaContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult> List()
    {
        var applications = await _db.DiscountApplications
            .Include(a => a.Account)
            .Where(a => a.State == DiscountApplicationState.Pending)
            .ToListAsync();

        return Ok(applications);
    }

    [HttpGet("{applicationId:int}/Image")]
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

    [HttpPost("{applicationId:int}/Approve")]
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

        return Ok();
    }
    
    [HttpPost("{applicationId:int}/Deny")]
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