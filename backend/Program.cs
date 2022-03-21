using System.Text;
using inertia;
using inertia.Authorization;
using inertia.Services;

using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using Stripe;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<inertia.InertiaContext>(
    options => options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")!)
);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDistributedMemoryCache();

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

builder.Services.AddHttpContextAccessor();

builder.Services.AddScoped<AuthenticationTokenService, AuthenticationTokenService>();
builder.Services.AddScoped<IAuthorizationHandler, DefaultAuthorizationHandler>();
builder.Services.AddScoped<IAuthorizationHandler, AccountIdentityHandler>();
builder.Services.AddScoped<ScootersService, ScootersService>();
builder.Services.AddScoped<UsersService, UsersService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Issuer"],
            ClockSkew = TimeSpan.Zero,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

builder.Services
    .AddAuthorization(options =>
    {
        options
            .AddPolicy(
                Policies.Authenticated,
                p => 
                    p.RequireAuthenticatedUser().AddRequirements(new DefaultAuthorization())
            );
        
        options
            .AddPolicy(
                Policies.MatchAccountId,
                p => 
                    p
                        .RequireAuthenticatedUser()
                        .AddRequirements(new DefaultAuthorization())
                        .AddRequirements(new AccountIdentityAuthorization())
            );
        
        options
            .AddPolicy(
                Policies.Employee,
                p => 
                    p
                        .RequireAuthenticatedUser()
                        .AddRequirements(new DefaultAuthorization())
                        .RequireRole(Roles.Employee)
            );

        options.DefaultPolicy = options.GetPolicy(Policies.Authenticated)!;
    });

var app = builder.Build();

StripeConfiguration.ApiKey = "sk_test_51KflboBY5x162kEq9heKyhTeTRUFIEub4IVTEr4X95rSvQZJn1tY7Wos2iR9zDazetLIzCUVwB2DAaFrOwTG058l00mkqn1k5F";

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    DbInitializer.Initialize(
        scope.ServiceProvider.GetRequiredService<InertiaContext>(),
        scope.ServiceProvider.GetRequiredService<UsersService>(),
        app.Environment
    );
}

app.Run();