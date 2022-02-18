using Microsoft.AspNetCore.Builder.Extensions;

namespace inertia;

using Microsoft.EntityFrameworkCore;
using Models;

public class InertiaContext : DbContext
{
    public DbSet<Depo> Depos { get; set; }

    public string DbPath { get; }
    
    public InertiaContext(DbContextOptions options) : base(options)
    {
    }
}