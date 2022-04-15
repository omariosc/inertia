using System.Security.Cryptography;
using inertia.Models;
using inertia.Enums;
using inertia.Services;

namespace inertia;

public class DbInitializer
{
    private static readonly RandomNumberGenerator RandomEngine = RandomNumberGenerator.Create();

    public static void Initialize(InertiaContext context, UsersService users, IWebHostEnvironment env)
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
            new Scooter {SoftScooterId = 100, Name = "100", Depo = locationA, Available = true},
            new Scooter {SoftScooterId = 101, Name = "101", Depo = locationA, Available = true},
            new Scooter {SoftScooterId = 102, Name = "102", Depo = locationA, Available = true},
            new Scooter {SoftScooterId = 103, Name = "103", Depo = locationA, Available = true},
            new Scooter {SoftScooterId = 104, Name = "104", Depo = locationB, Available = true},
            new Scooter {SoftScooterId = 105, Name = "105", Depo = locationB, Available = true},
            new Scooter {SoftScooterId = 106, Name = "106", Depo = locationB, Available = true},
            new Scooter {SoftScooterId = 107, Name = "107", Depo = locationB, Available = true},
            new Scooter {SoftScooterId = 108, Name = "108", Depo = locationC, Available = true},
            new Scooter {SoftScooterId = 109, Name = "109", Depo = locationC, Available = true},
            new Scooter {SoftScooterId = 200, Name = "200", Depo = locationC, Available = true},
            new Scooter {SoftScooterId = 201, Name = "201", Depo = locationC, Available = true},
            new Scooter {SoftScooterId = 202, Name = "202", Depo = locationD, Available = true},
            new Scooter {SoftScooterId = 203, Name = "203", Depo = locationD, Available = true},
            new Scooter {SoftScooterId = 204, Name = "204", Depo = locationD, Available = true},
            new Scooter {SoftScooterId = 205, Name = "205", Depo = locationD, Available = true},
            new Scooter {SoftScooterId = 206, Name = "206", Depo = locationE, Available = true},
            new Scooter {SoftScooterId = 207, Name = "207", Depo = locationE, Available = true},
            new Scooter {SoftScooterId = 208, Name = "208", Depo = locationE, Available = true},
            new Scooter {SoftScooterId = 209, Name = "209", Depo = locationE, Available = true},
        };
        
        foreach (var scooter in scooters)
        {
            context.Scooters.Add(scooter);
        }

        context.SaveChanges();

        var hireOptions = new HireOption[]
        {
            new HireOption {Name = "1 hour", Cost = 10, DurationInHours = 1},
            new HireOption {Name = "4 hours", Cost = 35, DurationInHours = 4},
            new HireOption {Name = "1 day", Cost = 200, DurationInHours = 24},
            new HireOption {Name = "1 week", Cost = 1600, DurationInHours = 168}
        };

        foreach (var h in hireOptions)
        {
            context.HireOptions.Add(h);
        }
        
        context.SaveChanges();

        var passwordAccounts = new string[]
        {
            UsersService.GeneratePassword(),
            UsersService.GeneratePassword(),
            UsersService.GeneratePassword(),
            UsersService.GeneratePassword(),
            UsersService.GeneratePassword(),
            UsersService.GeneratePassword(),
            UsersService.GeneratePassword(),
            UsersService.GeneratePassword(),
            UsersService.GeneratePassword(),
            UsersService.GeneratePassword(),
            UsersService.GeneratePassword(),
            UsersService.GeneratePassword(),
        };

        if (env.IsDevelopment())
        {
            passwordAccounts[0] = "admin";
        }
        
        var staffTask = users.CreateAccount(
            "admin@inertia",
            passwordAccounts[0], 
            "Root Account",
            UserType.Regular, 
            AccountRole.Manager
            );
        staffTask.Wait();
        var staff = staffTask.Result;

        var janeTask = users.CreateAccount(
                "jane@inertia",
                passwordAccounts[1],
                "Jane Le Fayette",
                UserType.Regular,
                AccountRole.User
            );
        janeTask.Wait();
        var jane = janeTask.Result;
        
        var jackTask = users.CreateAccount(
            "jack@inertia",
            passwordAccounts[2],
            "Jack Johanes",
            UserType.Regular,
            AccountRole.User
        );
        jackTask.Wait();
        var jack = jackTask.Result;

        var andreeaTask = users.CreateAccount(
            "andreea@inertia",
            passwordAccounts[3],
            "Andreea Maraiescu",
            UserType.Regular,
            AccountRole.User
        );
        andreeaTask.Wait();
        var andreea = andreeaTask.Result;

        var theodorTask = users.CreateAccount(
            "theodor@inertia",
            passwordAccounts[4],
            "Theodor Brown",
            UserType.Regular,
            AccountRole.User
        );
        theodorTask.Wait();
        var theodor = theodorTask.Result;

        var mikeTask = users.CreateAccount(
            "mike@inertia",
            passwordAccounts[5],
            "Mike Lorette",
            UserType.Regular,
            AccountRole.User
        );
        mikeTask.Wait();
        var mike = mikeTask.Result;

        var alexaTask = users.CreateAccount(
            "alexa@inertia",
            passwordAccounts[6],
            "Alexa",
            UserType.Regular,
            AccountRole.User
        );
        alexaTask.Wait();
        var alexa = alexaTask.Result;

        var andrewTask = users.CreateAccount(
            "andrew@inertia",
            passwordAccounts[7],
            "Andrew Lauren",
            UserType.Regular,
            AccountRole.User
        );
        andrewTask.Wait();
        var andrew = andrewTask.Result;

        var anaTask = users.CreateAccount(
            "ana@inertia",
            passwordAccounts[8],
            "Ana Drew",
            UserType.Regular,
            AccountRole.User
        );
        anaTask.Wait();
        var ana = anaTask.Result;

        var lunaTask = users.CreateAccount(
            "luna@inertia",
            passwordAccounts[9],
            "Luna",
            UserType.Regular,
            AccountRole.User
        );
        lunaTask.Wait();        
        var luna = lunaTask.Result;

        var skylerTask = users.CreateAccount(
            "skyler@inertia",
            passwordAccounts[10],
            "Skyler",
            UserType.Regular,
            AccountRole.User
        );
        skylerTask.Wait();
        var skyler = skylerTask.Result;

        var jessieTask = users.CreateAccount(
            "jessie@inertia",
            passwordAccounts[11],
            "Jessie",
            UserType.Regular,
            AccountRole.User
        );
        jessieTask.Wait();
        var jessie = jessieTask.Result;

        var customerAccounts = new Account?[]
        {
            jane,
            jack,
            andreea,
            theodor,
            mike,
            alexa,
            andrew,
            ana,
            luna,
            skyler,
            jessie
        };

        List<Order> orders = new List<Order>();
        DateTime startTime = DateTime.Today - TimeSpan.FromDays(61);

        int currentScooter = 0;
        foreach (var user in customerAccounts)
        {
            for (int i = 0; i < 7; i++)
            {
                DateTime time = startTime + TimeSpan.FromDays(i * 7);
                var oneHour = new Order
                {
                    OrderId = Nanoid.Nanoid.Generate(),
                    Account = user!,
                    Cost = hireOptions[0].Cost,
                    CreatedAt = time,
                    StartTime = time,
                    EndTime = time + TimeSpan.FromHours(hireOptions[0].DurationInHours),
                    HireOption = hireOptions[0],
                    Scooter = scooters[currentScooter],
                    OrderState = OrderState.Completed
                };

                time = oneHour.EndTime;
                var extension = new Order
                {
                    OrderId = Nanoid.Nanoid.Generate(),
                    Account = user!,
                    Cost = hireOptions[0].Cost,
                    CreatedAt = time,
                    StartTime = time,
                    EndTime = time + TimeSpan.FromHours(hireOptions[0].DurationInHours),
                    HireOption = hireOptions[0],
                    Scooter = scooters[currentScooter],
                    OrderState = OrderState.Completed,
                    Extends = oneHour
                };

                time = extension.EndTime;
                time += TimeSpan.FromHours(1);
                
                var fourHours = new Order
                {
                    OrderId = Nanoid.Nanoid.Generate(),
                    Account = user!,
                    Cost = hireOptions[1].Cost,
                    CreatedAt = time,
                    StartTime = time,
                    EndTime = time + TimeSpan.FromHours(hireOptions[1].DurationInHours),
                    HireOption = hireOptions[1],
                    Scooter = scooters[currentScooter],
                    OrderState = OrderState.Completed
                };
                
                time = fourHours.EndTime;
                time += TimeSpan.FromHours(1);
                
                var oneDay = new Order
                {
                    OrderId = Nanoid.Nanoid.Generate(),
                    Account = user!,
                    Cost = hireOptions[2].Cost,
                    CreatedAt = time,
                    StartTime = time,
                    EndTime = time + TimeSpan.FromHours(hireOptions[2].DurationInHours),
                    HireOption = hireOptions[2],
                    Scooter = scooters[currentScooter],
                    OrderState = OrderState.Completed
                };
                
                time = oneDay.EndTime;
                time += TimeSpan.FromHours(1);

                var oneWeek = new Order
                {
                    OrderId = Nanoid.Nanoid.Generate(),
                    Account = user!,
                    Cost = hireOptions[3].Cost,
                    CreatedAt = time,
                    StartTime = time,
                    EndTime = time + TimeSpan.FromHours(hireOptions[3].DurationInHours),
                    HireOption = hireOptions[3],
                    Scooter = scooters[currentScooter],
                    OrderState = OrderState.Completed
                };
                
                orders.Add(oneDay);
                orders.Add(oneHour);
                orders.Add(extension);
                orders.Add(oneWeek);
                orders.Add(fourHours);
            }
            
            currentScooter++;
        }

        foreach (var order in orders)
        {
            context.Orders.Add(order);
        }

        context.SaveChanges();

        if (env.IsDevelopment())
        {
            users.CreateAccount("inertiateam420+test@gmail.com", "test_password", "Le Customer", UserType.Regular, AccountRole.User).Wait();
            users.CreateAccount("inertiateam420+test2@gmail.com", "test_password", "Le Staff", UserType.Regular, AccountRole.Manager).Wait();
        }
        
        Console.Out.WriteLine("Staff Login:");
        Console.Out.WriteLine($"email: {staff!.Email}; password: {passwordAccounts[0]}");
        Console.Out.WriteLine("Customer Login: ");
        for (int i = 0; i < customerAccounts.Length; i++)
        {
            Console.Out.WriteLine($"email: {customerAccounts[i]!.Email}; password: {passwordAccounts[i + 1]}");
        }

    }
}