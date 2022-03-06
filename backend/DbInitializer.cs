using inertia.Models;
using System;
using System.Linq;
using inertia.Enums;

namespace inertia;

public class DbInitializer
{
    public static void Initialize(InertiaContext context)
    {
        context.Database.EnsureCreated();

        if (context.Depos.Any())
        {
            return;
        }

        foreach (var depo in
                 new Depo[]
                 {
                    new Depo{Latitude = 53.798351f, Longitude = -1.545100f, Name = "Trinity Centre"},
                    new Depo{Latitude = 53.796770f, Longitude = -1.540510f, Name = "Train Station"},
                    new Depo{Latitude = 53.801270f, Longitude = -1.543190f, Name = "Merrion Centre"},
                    new Depo{Latitude = 53.802509f, Longitude = -1.552887f, Name = "Leeds General Infirmary"},
                    new Depo{Latitude = 53.804167f, Longitude = -1.553208f, Name = "UoL Edge Sports Centre"}
                 })
        {
            context.Depos.Add(depo);
        }
        context.SaveChanges();

        var locationA = context.Depos.Single(e => e.Name == "Trinity Centre");
        var locationB = context.Depos.Single(e => e.Name == "Train Station");
        var locationC = context.Depos.Single(e => e.Name == "Merrion Centre");
        var locationD = context.Depos.Single(e => e.Name == "Leeds General Infirmary");
        var locationE = context.Depos.Single(e => e.Name == "UoL Edge Sports Centre");

        var scooters = new Scooter[]
        {
            new Scooter {ScooterId = 100, Depo = locationA, Available = true},
            new Scooter {ScooterId = 101, Depo = locationA, Available = true},
            new Scooter {ScooterId = 102, Depo = locationA, Available = true},
            new Scooter {ScooterId = 103, Depo = locationA, Available = true},
            new Scooter {ScooterId = 104, Depo = locationB, Available = true},
            new Scooter {ScooterId = 105, Depo = locationB, Available = true},
            new Scooter {ScooterId = 106, Depo = locationB, Available = true},
            new Scooter {ScooterId = 107, Depo = locationB, Available = true},
            new Scooter {ScooterId = 108, Depo = locationC, Available = true},
            new Scooter {ScooterId = 109, Depo = locationC, Available = true},
            new Scooter {ScooterId = 200, Depo = locationC, Available = true},
            new Scooter {ScooterId = 201, Depo = locationC, Available = true},
            new Scooter {ScooterId = 202, Depo = locationD, Available = true},
            new Scooter {ScooterId = 203, Depo = locationD, Available = true},
            new Scooter {ScooterId = 204, Depo = locationD, Available = true},
            new Scooter {ScooterId = 205, Depo = locationD, Available = true},
            new Scooter {ScooterId = 206, Depo = locationE, Available = true},
            new Scooter {ScooterId = 207, Depo = locationE, Available = true},
            new Scooter {ScooterId = 208, Depo = locationE, Available = true},
            new Scooter {ScooterId = 209, Depo = locationE, Available = true},
        };
        
        foreach (var scooter in scooters)
        {
            context.Scooters.Add(scooter);
        }

        context.SaveChanges();

        context.HireOptions.Add(new HireOption {Name = "1 hour", Cost = 10, DurationInHours = 1});
        context.HireOptions.Add(new HireOption {Name = "4 hours", Cost = 35, DurationInHours = 4});
        context.HireOptions.Add(new HireOption {Name = "1 day", Cost = 200, DurationInHours = 24});
        context.HireOptions.Add(new HireOption {Name = "1 week", Cost = 1600, DurationInHours = 168});

        context.SaveChanges();
        
        var account = new Account
        {
            AccountId = "testid",
            Name = "Test Account",
            Email = "test@test.com",
            Password = "test_password",
            Role = AccountRole.User,
            State = AccountState.Active,
            UserType = UserType.Regular
        };
        context.Accounts.Add(account);
        context.SaveChanges();

        foreach (var order in new[]
                 {
                     new Order
                     {
                         OrderId="order1",
                         Scooter = scooters[2],
                         Account = account,
                         StartTime = DateTime.UtcNow.AddDays(-10),
                         EndTime = DateTime.UtcNow.AddDays(10),
                         Cost = 4.2f,
                         OrderState = OrderState.Ongoing
                     }
                 })
        {
            context.Orders.Add(order);
        }
        context.SaveChanges();
    }
}