using EntityFramework.Exceptions.Sqlite;
using Microsoft.EntityFrameworkCore;
using inertia.Models;
using inertia.Util;

namespace inertia;

public class InertiaContext : DbContext
{
    public DbSet<Depo> Depos { get; set; } = null!;
    public DbSet<Scooter> Scooters { get; set; } = null!;

    public DbSet<Account> Accounts { get; set; } = null!;

    public DbSet<LoginInstance> LoginInstances { get; set; } = null!;

    public DbSet<Order> Orders { get; set; } = null!;

    public DbSet<HireOption> HireOptions { get; set; } = null!;

    public DbSet<Issue> Issues { get; set; } = null!;
    
    public DbSet<DiscountApplication> DiscountApplications { get; set; } = null!;
    
    public InertiaContext(DbContextOptions options) : base(options)
    {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
        optionsBuilder.UseExceptionProcessor();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(ISoftDelete).IsAssignableFrom(entityType.ClrType))
                entityType.AddSoftDeleteQueryFilter();
        }
    }
}