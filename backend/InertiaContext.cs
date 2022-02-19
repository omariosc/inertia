using Microsoft.AspNetCore.Builder.Extensions;

namespace inertia;

using Microsoft.EntityFrameworkCore;
using Models;

public class InertiaContext : DbContext
{
    public DbSet<Depo> Depos { get; set; } = null!;
    public DbSet<Scooter> Scooters { get; set; } = null!;
    
    public InertiaContext(DbContextOptions options) : base(options)
    {
    }
}