using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace inertia.Controllers;

[Route("create-payment-intent")]
[ApiController]
public class StripeApiController : Controller
{
    private readonly InertiaContext _db;

    public StripeApiController(InertiaContext db)
    {
        _db = db;
    }
    
    [HttpPost]
    public async Task<ActionResult> Create(PaymentIntentCreateRequest request)
    {
        var paymentIntentService = new PaymentIntentService();
        var paymentIntent = paymentIntentService.Create(new PaymentIntentCreateOptions
        {
            Amount = await CalculateOrderAmount(request.Items),
            Currency = "gbp",
            AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
            {
                Enabled = true,
            },
        });

        return Json(new { clientSecret = paymentIntent.ClientSecret });
    }

    private async Task<int> CalculateOrderAmount(Item[] items)
    {
        var order = await _db.Orders.Where(e => e.OrderId == items[0].Id).FirstOrDefaultAsync();
        return (int)(order!.Cost * 100);
    }

    public class Item
    {
        [JsonPropertyName("id")] public string Id { get; set; } = null!;
    }

    public class PaymentIntentCreateRequest
    {
        [JsonPropertyName("items")] public Item[] Items { get; set; } = null!;
    }
}