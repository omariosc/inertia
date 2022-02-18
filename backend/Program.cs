using inertia;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<inertia.InertiaContext>(
    options => options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")!)
);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    try
    {
        DbInitializer.Initialize(
            scope.ServiceProvider.GetRequiredService<InertiaContext>()
        );
    }
    catch (Exception e)
    {
        scope.ServiceProvider.GetRequiredService<ILogger>()
            .LogError(e, "An error occured creating the DB.");
    }
}

app.Run();