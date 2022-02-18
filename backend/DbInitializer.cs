using inertia.Models;
using System;
using System.Linq;

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
        
        foreach (var scooter in 
                 new Scooter[]
                 {
                     new Scooter{ScooterId = 100, Depo = locationA, Available = true},
                     new Scooter{ScooterId = 101, Depo = locationA, Available = true},
                     new Scooter{ScooterId = 102, Depo = locationA, Available = true},
                     new Scooter{ScooterId = 103, Depo = locationA, Available = true},
                     new Scooter{ScooterId = 104, Depo = locationB, Available = true},
                     new Scooter{ScooterId = 105, Depo = locationB, Available = true},
                     new Scooter{ScooterId = 106, Depo = locationB, Available = true},
                     new Scooter{ScooterId = 107, Depo = locationB, Available = true},
                     new Scooter{ScooterId = 108, Depo = locationC, Available = true},
                     new Scooter{ScooterId = 109, Depo = locationC, Available = true},
                     new Scooter{ScooterId = 200, Depo = locationC, Available = true},
                     new Scooter{ScooterId = 201, Depo = locationC, Available = true},
                     new Scooter{ScooterId = 202, Depo = locationD, Available = true},
                     new Scooter{ScooterId = 203, Depo = locationD, Available = true},
                     new Scooter{ScooterId = 204, Depo = locationD, Available = true},
                     new Scooter{ScooterId = 205, Depo = locationD, Available = true},
                     new Scooter{ScooterId = 206, Depo = locationE, Available = true},
                     new Scooter{ScooterId = 207, Depo = locationE, Available = true},
                     new Scooter{ScooterId = 208, Depo = locationE, Available = true},
                     new Scooter{ScooterId = 209, Depo = locationE, Available = true},
                 })
        {
            context.Scooters.Add(scooter);
        }
        
        context.SaveChanges();
    }
}