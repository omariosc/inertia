using System.Net.Mail;
using inertia.Models;
using inertia.Views;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.EntityFrameworkCore;
using MimeKit;

namespace inertia.Services;

/// <summary>
/// The service that handles templating the email content
/// and sending the emails
/// </summary>
public class EmailService
{
    private readonly IRazorViewEngine _razorViewEngine;
    private readonly ITempDataProvider _tempDataProvider;
    private readonly IServiceProvider _serviceProvider;
    private readonly string _senderEmail;
    private readonly string _senderName;
    private readonly string _senderPassword;
    private readonly int _port;
    private readonly string _server;
    private readonly InertiaContext _db;
    private readonly SecureSocketOptions _sslOption;
    private readonly ILogger<EmailService> _logger;
    
    public EmailService(
        IRazorViewEngine razorViewEngine,
        ITempDataProvider tempDataProvider,
        IServiceProvider serviceProvider,
        IConfiguration configuration,
        InertiaContext db,
        ILogger<EmailService> logger)
    {
        _razorViewEngine = razorViewEngine;
        _tempDataProvider = tempDataProvider;
        _serviceProvider = serviceProvider;
        _senderEmail = configuration["SmtpSettings:SenderEmail"];
        _senderName = configuration["SmtpSettings:SenderName"];
        _senderPassword = configuration["SmtpSettings:Password"];
        _port = int.Parse(configuration["SmtpSettings:Port"]);
        _server = configuration["SmtpSettings:Server"];
        _db = db;
        _logger = logger;
        
        var ssl = configuration["SmtpSettings:SSL"];

        switch (ssl)
        {
            case "Yes":
                _sslOption = SecureSocketOptions.Auto;
                break;
            case "No":
                _sslOption = SecureSocketOptions.None;
                break;    
            case "StartTls":
                _sslOption = SecureSocketOptions.StartTls;
                break;
        }
    }

    /// <summary>
    /// Renders the render confirmation email and sends to the user.
    /// </summary>
    /// <param name="email"></param>
    /// <param name="order"></param>
    public async Task SendOrderConfirmation(string email, Order order)
    {
        _db.Entry(order).Reference(o => o.Scooter).Load();
        _db.Entry(order).Reference(o => o.HireOption).Load();
        _db.Entry(order).Reference(o => o.Account).Load();
        _db.Entry(order.Scooter).Reference(s => s.Depo).Load();

        var model = new OrderConfirmationModel
        {
            ScooterId = order.Scooter.SoftScooterId,
            Depo = $"{order.Scooter.Depo.Name}, {order.Scooter.Depo.Address}",
            OrderId = order.OrderId,
            HireOptionName = order.HireOption.Name,
            Cost = order.Cost,
            Discount = order.Discount,
            Name = order.Account.Name,
            PreDiscountCost = order.PreDiscountCost
        };
        string data = await RenderToStringAsync("OrderConfirmation", model);
        await SendEmail(email, $"Booking no. {order.OrderId} confirmation", data);
    }

    /// <summary>
    /// Renders the render order approval email and sends to the user.
    /// </summary>
    /// <param name="email"></param>
    /// <param name="order"></param>
    public async Task SendOrderApproval(string email, Order order)
    {
        _db.Entry(order).Reference(o => o.Scooter).Load();
        _db.Entry(order).Reference(o => o.HireOption).Load();
        _db.Entry(order).Reference(o => o.Account).Load();
        _db.Entry(order.Scooter).Reference(s => s.Depo).Load();

        var model = new OrderApprovalModel
        {
            Name = order.Account.Name,
            OrderId = order.OrderId,
        };
        
        string data = await RenderToStringAsync("OrderApproval", model);
        await SendEmail(email, $"Booking no. {order.OrderId} has been approved", data);
    }

    /// <summary>
    /// Renders the order denied email and sends to the user.
    /// </summary>
    /// <param name="email"></param>
    /// <param name="order"></param>
    public async Task SendOrderDenied(string email, Order order)
    {
        _db.Entry(order).Reference(o => o.Scooter).Load();
        _db.Entry(order).Reference(o => o.HireOption).Load();
        _db.Entry(order).Reference(o => o.Account).Load();
        _db.Entry(order.Scooter).Reference(s => s.Depo).Load();

        var model = new OrderDeniedModel
        {
            Name = order.Account.Name,
            OrderId = order.OrderId,
        };
        
        string data = await RenderToStringAsync("OrderDenied", model);
        await SendEmail(email, $"Booking no. {order.OrderId} has been denied", data);
    }

    /// <summary>
    /// Renders the order cancellation email and sends to the user.
    /// </summary>
    /// <param name="email"></param>
    /// <param name="order"></param>
    public async Task SendOrderCancellation(string email, Order order)
    {
        _db.Entry(order).Reference(o => o.Scooter).Load();
        _db.Entry(order).Reference(o => o.HireOption).Load();
        _db.Entry(order).Reference(o => o.Account).Load();
        _db.Entry(order.Scooter).Reference(s => s.Depo).Load();

        var model = new OrderCancellationModel
        {
            ScooterId = order.Scooter.SoftScooterId,
            Depo = $"{order.Scooter.Depo.Name}, {order.Scooter.Depo.Address}",
            OrderId = order.OrderId,
            HireOptionName = order.HireOption.Name,
            Cost = order.Cost,
            Discount = order.Discount,
            Name = order.Account.Name,
            PreDiscountCost = order.PreDiscountCost
        };
        string data = await RenderToStringAsync("OrderCancellation", model);
        await SendEmail(email, $"Booking no. {order.OrderId} has been cancelled", data);
    }

    /// <summary>
    /// Renders the order was extended email and sends to the user.
    /// </summary>
    /// <param name="email"></param>
    /// <param name="order"></param>
    public async Task SendOrderExtension(string email, Order order)
    {
        _db.Entry(order).Reference(o => o.Scooter).Load();
        _db.Entry(order).Reference(o => o.HireOption).Load();
        _db.Entry(order).Reference(o => o.Account).Load();
        _db.Entry(order.Scooter).Reference(s => s.Depo).Load();
        
        var extensions = await _db.Orders
            .Where(o => o.OrderId == order.OrderId || o.ExtendsId == order.OrderId)
            .OrderBy(o => o.CreatedAt)
            .Select(o => new
            {
                o.HireOption.Name,
                o.CreatedAt
            })
            .ToListAsync();

        var model = new OrderExtensionModel
        {
            ScooterId = order.ScooterId,
            Depo = $"{order.Scooter.Depo.Name}, {order.Scooter.Depo.Address}",
            OrderId = order.OrderId,
            Cost = order.Cost,
            Discount = order.Discount,
            Name = order.Account.Name,
            PreDiscountCost = order.PreDiscountCost,
            Extensions = extensions
                .Select(e => new Tuple<string, DateTime>(e.Name, e.CreatedAt))
                .ToList()
        };
        
        string data = await RenderToStringAsync("OrderExtension", model);
        await SendEmail(email, $"Booking no. {order.OrderId} has been updated", data);
    }
    
    /// <summary>
    /// Renders the successful discount application email and sends to the user.
    /// </summary>
    /// <param name="email"></param>
    /// <param name="account"></param>
    public async Task SendDiscountApplication(string email, Account account)
    {
        var model = new DiscountApplicationModel
        {
            Name = account.Name,
            DiscountType = account.UserType.ToString()
        };
        
        string data = await RenderToStringAsync("Signup", model);
        await SendEmail(email, $"Your discount application has been approved!", data);
    }

    /// <summary>
    /// Renders the signup confirmation email and sends to the user.
    /// </summary>
    /// <param name="email"></param>
    /// <param name="account"></param>
    public async Task SendSignup(string email, Account account)
    {
        var model = new SignupModel
        {
            Name = account.Name,
            AccountId = account.AccountId
        };
        
        string data = await RenderToStringAsync("Signup", model);
        await SendEmail(email, $"Welcome to Inertia!", data);
    }
    
    /// <summary>
    /// Sends an email to the user.
    /// </summary>
    /// <param name="recipientEmail"></param>
    /// <param name="subject"></param>
    /// <param name="htmlBody"></param>
    private async Task SendEmail(string recipientEmail, string subject, string htmlBody)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_senderName, _senderEmail));
        message.To.Add(new MailboxAddress(null, recipientEmail));
        message.Subject = subject;

        var body = new BodyBuilder();
        body.HtmlBody = htmlBody;

        message.Body = body.ToMessageBody();

        try
        {
            using (var client = new MailKit.Net.Smtp.SmtpClient())
            {
                await client.ConnectAsync(_server, _port, _sslOption);
                await client.AuthenticateAsync(_senderEmail, _senderPassword);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
            }
        }
        catch (Exception e)
        {
            _logger.LogWarning(e.Message);
        }
    }

    /// <summary>
    /// Renders a razor page view into a string.
    /// </summary>
    /// <param name="viewName"></param>
    /// <param name="model"></param>
    /// <returns></returns>
    /// <exception cref="ArgumentNullException"></exception>
    private async Task<string> RenderToStringAsync(string viewName, object model)
    {
        var httpContext = new DefaultHttpContext { RequestServices = _serviceProvider };
        var actionContext = new ActionContext(httpContext, new RouteData(), new ActionDescriptor());
        using (var sw = new StringWriter())
        {
            var viewResult = _razorViewEngine.FindView(actionContext, viewName, false);
            if (viewResult.View == null)
            {
                throw new ArgumentNullException($"{viewName} does not match any available view");
            }

            var viewDictionary = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary());
            viewDictionary.Add("Data", model);
            
            var viewContext = new ViewContext(
                actionContext,
                viewResult.View,
                viewDictionary,
                new TempDataDictionary(actionContext.HttpContext, _tempDataProvider),
                sw,
                new HtmlHelperOptions()
            );
            
            await viewResult.View.RenderAsync(viewContext);
            return sw.ToString();
        }
    }
}