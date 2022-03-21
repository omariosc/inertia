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
            new Scooter {ScooterId = 100, Depo = locationA},
            new Scooter {ScooterId = 101, Depo = locationA},
            new Scooter {ScooterId = 102, Depo = locationA},
            new Scooter {ScooterId = 103, Depo = locationA},
            new Scooter {ScooterId = 104, Depo = locationB},
            new Scooter {ScooterId = 105, Depo = locationB},
            new Scooter {ScooterId = 106, Depo = locationB},
            new Scooter {ScooterId = 107, Depo = locationB},
            new Scooter {ScooterId = 108, Depo = locationC},
            new Scooter {ScooterId = 109, Depo = locationC},
            new Scooter {ScooterId = 200, Depo = locationC},
            new Scooter {ScooterId = 201, Depo = locationC},
            new Scooter {ScooterId = 202, Depo = locationD},
            new Scooter {ScooterId = 203, Depo = locationD},
            new Scooter {ScooterId = 204, Depo = locationD},
            new Scooter {ScooterId = 205, Depo = locationD},
            new Scooter {ScooterId = 206, Depo = locationE},
            new Scooter {ScooterId = 207, Depo = locationE},
            new Scooter {ScooterId = 208, Depo = locationE},
            new Scooter {ScooterId = 209, Depo = locationE},
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
            GeneratePassword(),
            GeneratePassword(),
            GeneratePassword(),
            GeneratePassword(),
            GeneratePassword(),
            GeneratePassword(),
            GeneratePassword(),
            GeneratePassword(),
            GeneratePassword(),
            GeneratePassword(),
            GeneratePassword(),
            GeneratePassword(),
        };

        if (env.IsDevelopment())
        {
            passwordAccounts[0] = "admin";
        }
        
        var staffTask = users.CreateEmployeeAccount(
            "admin@inertia", 
            passwordAccounts[0], 
            "Root Account"
            );
        staffTask.Wait();
        var staff = staffTask.Result;

        var janeTask = users.CreateAccount(
                "jane@inertia",
                passwordAccounts[1],
                "Jane Le Fayette",
                UserType.Regular
            );
        janeTask.Wait();
        var jane = janeTask.Result;
        
        var jackTask = users.CreateAccount(
            "jack@inertia",
            passwordAccounts[2],
            "Jack Johanes",
            UserType.Regular
        );
        jackTask.Wait();
        var jack = jackTask.Result;

        var andreeaTask = users.CreateAccount(
            "andreea@inertia",
            passwordAccounts[3],
            "Andreea Maraiescu",
            UserType.Regular
        );
        andreeaTask.Wait();
        var andreea = andreeaTask.Result;

        var theodorTask = users.CreateAccount(
            "theodor@inertia",
            passwordAccounts[4],
            "Theodor Brown",
            UserType.Regular
        );
        theodorTask.Wait();
        var theodor = theodorTask.Result;

        var mikeTask = users.CreateAccount(
            "mike@inertia",
            passwordAccounts[5],
            "Mike Lorette",
            UserType.Regular
        );
        mikeTask.Wait();
        var mike = mikeTask.Result;

        var alexaTask = users.CreateAccount(
            "alexa@inertia",
            passwordAccounts[6],
            "Alexa",
            UserType.Regular
        );
        alexaTask.Wait();
        var alexa = alexaTask.Result;

        var andrewTask = users.CreateAccount(
            "andrew@inertia",
            passwordAccounts[7],
            "Andrew Lauren",
            UserType.Regular
        );
        andrewTask.Wait();
        var andrew = andrewTask.Result;

        var anaTask = users.CreateAccount(
            "ana@inertia",
            passwordAccounts[8],
            "Ana Drew",
            UserType.Regular
        );
        anaTask.Wait();
        var ana = anaTask.Result;

        var lunaTask = users.CreateAccount(
            "luna@inertia",
            passwordAccounts[9],
            "Luna",
            UserType.Regular
        );
        lunaTask.Wait();        
        var luna = lunaTask.Result;

        var skylerTask = users.CreateAccount(
            "skyler@inertia",
            passwordAccounts[10],
            "Skyler",
            UserType.Regular
        );
        skylerTask.Wait();
        var skyler = skylerTask.Result;

        var jessieTask = users.CreateAccount(
            "jessie@inertia",
            passwordAccounts[11],
            "Jessie",
            UserType.Regular
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
            users.CreateAccount("test@test.com", "test_password", "Le Customer", UserType.Regular).Wait();
            users.CreateEmployeeAccount("test2@test.com", "test_password", "Le Staff").Wait();
        }
        
        Console.Out.WriteLine("Staff Login:");
        Console.Out.WriteLine($"email: {staff!.Email}; password: {passwordAccounts[0]}");
        Console.Out.WriteLine("Customer Login: ");
        for (int i = 0; i < customerAccounts.Length; i++)
        {
            Console.Out.WriteLine($"email: {customerAccounts[i]!.Email}; password: {passwordAccounts[i + 1]}");
        }

    }
    
    private static string GeneratePassword()
    {
        int passwordLength = 40;
        var password = new byte[passwordLength];
        RandomEngine.GetBytes(password);

        return Convert.ToBase64String(password);
    }
}