using inertia.Authorization;
using inertia.Dtos;
using inertia.Enums;
using inertia.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace inertia.Controllers.Admin;

[ApiController]
[Route("api/admin/[controller]")]
[Produces("application/json")]
[Consumes("application/json")]
[Authorize(Policy = Policies.Employee)]
public class IssuesController : MyControllerBase
{
    private readonly InertiaContext _db;
    
    public IssuesController(InertiaContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<Issue>>> ListIssues(
        [FromQuery] bool? closed,
        [FromQuery] IssuePriority? priority
        )
    {
        var issuesQuery = _db.Issues
            .AsQueryable();

        if (closed is true)
            issuesQuery = issuesQuery.Where(i => i.Resolution != null);
        
        if (closed is false)
            issuesQuery = issuesQuery.Where(i => i.Resolution == null);

        if (priority != null)
            issuesQuery = issuesQuery.Where(i => i.Priority == priority);

        var issues = await issuesQuery
            .Include(i => i.Account)
            .OrderByDescending(i => i.DateOpened)
            .ToListAsync();
        return Ok(issues);
    }

    [HttpGet("{issueId:int}")]
    [ProducesResponseType(typeof(ApplicationError), 422)]
    [ProducesResponseType(typeof(Issue), 200)]
    public async Task<ActionResult> GetIssue(int issueId)
    {
        var issue = await _db.Issues
            .Where(i => i.IssueId == issueId)
            .FirstOrDefaultAsync();

        if (issue == null)
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "invalid issue id", "issue");

        return Ok(issue);
    }
    
    [HttpPatch("{issueId:int}")]
    [ProducesResponseType(typeof(ApplicationError), 422)]
    [ProducesResponseType(typeof(Issue), 200)]
    public async Task<ActionResult> PatchIssue(
        int issueId,
        [FromBody] PatchIssueRequest request)
    {
        var issue = await _db.Issues
            .Where(i => i.IssueId == issueId)
            .FirstOrDefaultAsync();

        if (issue == null)
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "invalid issue id", "issue");

        if (request.Resolution != null && issue.Resolution != null)
            return ApplicationError(ApplicationErrorCode.AttemptingToCloseAlreadyClosedIssue,
                "issue was already closed");

        issue.Priority = request.Priority ?? issue.Priority;
        issue.Resolution = request.Resolution;

        await _db.SaveChangesAsync();
        
        return Ok(issue);
    }
}