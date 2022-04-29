using EntityFramework.Exceptions.Sqlite;
using Microsoft.EntityFrameworkCore;
using inertia.Models;
using inertia.Util;

namespace inertia;

/// <summary>
/// Database context of the application. All tables are generated from this class by Entity Framework
/// </summary>
public class InertiaContext : DbContext
{
    /// <summary>
    /// Table for Depos
    /// </summary>
    public DbSet<Depo> Depos { get; set; } = null!;
    
    /// <summary>
    /// Table for Scooters
    /// </summary>
    public DbSet<Scooter> Scooters { get; set; } = null!;

    /// <summary>
    /// Table for Accounts
    /// </summary>
    public DbSet<Account> Accounts { get; set; } = null!;

    /// <summary>
    /// Table for LoginInstances
    /// </summary>
    public DbSet<LoginInstance> LoginInstances { get; set; } = null!;

    /// <summary>
    /// Table for Orders
    /// </summary>
    public DbSet<Order> Orders { get; set; } = null!;

    /// <summary>
    /// Table for HireOptions
    /// </summary>
    public DbSet<HireOption> HireOptions { get; set; } = null!;

    /// <summary>
    /// Table for Issues
    /// </summary>
    public DbSet<Issue> Issues { get; set; } = null!;
    
    
    /// <summary>
    /// Table for DiscountApplications
    /// </summary>
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