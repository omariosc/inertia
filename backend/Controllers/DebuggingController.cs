using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace inertia.Controllers;

[ApiController]
[Route("[controller]")]
[Produces("application/json")]
public class DebuggingController : ControllerBase
{
    private readonly InertiaContext _db;
    private readonly IWebHostEnvironment _env;

    public DebuggingController(InertiaContext db, IWebHostEnvironment env)
    {
        _db = db;
        _env = env;
    }

    [HttpGet("remove/account/{email}")]
    public async Task<ActionResult> RemoveAccount(string email)
    {
        if (!_env.IsDevelopment())
            return NotFound();

        var account = await _db.Accounts
            .Where(a => a.Email == email)
            .FirstOrDefaultAsync();

        if (account == null)
            return UnprocessableEntity();

        _db.Accounts.Remove(account);
        await _db.SaveChangesAsync();
                
        return Ok();
    }

    [HttpGet("remove/order/{orderId}")]
    public async Task<ActionResult> RemoveOrder(string orderId)
    {
        if (!_env.IsDevelopment())
            return NotFound();

        var order = await _db.Orders
            .Where(o => o.OrderId == orderId)
            .FirstOrDefaultAsync();
        
        if (order == null)
            return UnprocessableEntity();

        _db.Orders.Remove(order);
        await _db.SaveChangesAsync();

        return Ok();
    }
}