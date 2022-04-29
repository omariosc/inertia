using inertia.Authorization;
using inertia.Dtos;
using inertia.Enums;
using inertia.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace inertia.Controllers.Admin;


/// <summary>
/// admin controller that implements the issue system.
/// </summary>
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

    /// <summary>
    /// Lists issues, filtering through them; by default all issues are returned
    /// </summary>
    /// <param name="closed">filters by closed issues</param>
    /// <param name="priority">filters by priority</param>
    /// <returns></returns>
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

    /// <summary>
    /// gets all details of an issue, by id.
    /// </summary>
    /// <param name="issueId"></param>
    /// <returns></returns>
    [HttpGet("{issueId:int}")]
    [ProducesResponseType(typeof(ApplicationError), 422)]
    [ProducesResponseType(typeof(Issue), 200)]
    public async Task<ActionResult> GetIssue(int issueId)
    {
        var issue = await _db.Issues
            .Where(i => i.IssueId == issueId)
            .Include(i=>i.Account)
            .FirstOrDefaultAsync();

        if (issue == null)
            return ApplicationError(ApplicationErrorCode.InvalidEntity, "invalid issue id", "issue");

        return Ok(issue);
    }
    
    /// <summary>
    /// Modifies an issue, by id. Used to escalate, deescalate and close issues. 
    /// </summary>
    /// <param name="issueId"></param>
    /// <param name="request"></param>
    /// <returns></returns>
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