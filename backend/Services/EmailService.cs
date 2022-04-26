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
    private readonly bool _ssl;
    private readonly InertiaContext _db;

    public EmailService(
        IRazorViewEngine razorViewEngine,
        ITempDataProvider tempDataProvider,
        IServiceProvider serviceProvider,
        IConfiguration configuration,
        InertiaContext db)
    {
        _razorViewEngine = razorViewEngine;
        _tempDataProvider = tempDataProvider;
        _serviceProvider = serviceProvider;
        _senderEmail = configuration["SmtpSettings:SenderEmail"];
        _senderName = configuration["SmtpSettings:SenderName"];
        _senderPassword = configuration["SmtpSettings:Password"];
        _port = int.Parse(configuration["SmtpSettings:Port"]);
        _server = configuration["SmtpSettings:Server"];
        _ssl = bool.Parse(configuration["SmtpSettings:SSL"]);
        _db = db;
    }

    public async Task SendOrderConfirmation(string email, Order order)
    {
        _db.Entry(order).Reference(o => o.Scooter).Load();
        _db.Entry(order).Reference(o => o.HireOption).Load();
        _db.Entry(order).Reference(o => o.Account).Load();

        var model = new OrderConfirmationModel
        {
            ScooterId = order.ScooterId,
            DepoId = order.Scooter.DepoId,
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

    public async Task SendOrderApproval(string email, Order order)
    {
        _db.Entry(order).Reference(o => o.Scooter).Load();
        _db.Entry(order).Reference(o => o.HireOption).Load();
        _db.Entry(order).Reference(o => o.Account).Load();

        var model = new OrderApprovalModel
        {
            Name = order.Account.Name,
            OrderId = order.OrderId,
        };
        
        string data = await RenderToStringAsync("Order Approval", model);
        await SendEmail(email, $"Booking no. {order.OrderId} has been approved", data);
    }

    public async Task SendOrderCancellation(string email, Order order)
    {
        _db.Entry(order).Reference(o => o.Scooter).Load();
        _db.Entry(order).Reference(o => o.HireOption).Load();
        _db.Entry(order).Reference(o => o.Account).Load();

        var model = new OrderCancellationModel
        {
            ScooterId = order.ScooterId,
            DepoId = order.Scooter.DepoId,
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

    public async Task SendOrderExtension(string email, Order order)
    {
        _db.Entry(order).Reference(o => o.Scooter).Load();
        _db.Entry(order).Reference(o => o.HireOption).Load();
        _db.Entry(order).Reference(o => o.Account).Load();
        var extensions = await _db.Orders
            .Where(o => o.OrderId == order.OrderId || o.ExtendsId == order.OrderId)
            .OrderBy(o => o.CreatedAt)
            .Select(o => o.HireOption.Name)
            .ToListAsync();

        var model = new OrderExtensionModel
        {
            ScooterId = order.ScooterId,
            DepoId = order.Scooter.DepoId,
            OrderId = order.OrderId,
            Cost = order.Cost,
            Discount = order.Discount,
            Name = order.Account.Name,
            PreDiscountCost = order.PreDiscountCost,
            Extensions = extensions
        };
        
        string data = await RenderToStringAsync("OrderExtension", model);
        await SendEmail(email, $"Booking no. {order.OrderId} has been updated", data);
    }
    
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
    
    private async Task SendEmail(string recipientEmail, string subject, string htmlBody)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_senderName, _senderEmail));
        message.To.Add(new MailboxAddress(null, recipientEmail));
        message.Subject = subject;

        var body = new BodyBuilder();
        body.HtmlBody = htmlBody;

        message.Body = body.ToMessageBody();
        
        using (var client = new MailKit.Net.Smtp.SmtpClient())
        {
            await client.ConnectAsync(_server, _port, _ssl);
            await client.AuthenticateAsync(_senderEmail, _senderPassword);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
    }

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