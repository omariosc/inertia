namespace inertia.Services;

/// <summary>
/// Recurring task that calculates the Frequent Users
/// every week.
/// </summary>
public class FrequentUsersService : CronJobService
{
    private readonly ILogger<FrequentUsersService> _logger;
    private readonly IServiceScopeFactory _factory;
    
    public FrequentUsersService(
        IScheduleConfig<FrequentUsersService> config, 
        ILogger<FrequentUsersService> logger,
        IServiceScopeFactory factory
        )
        : base(config.CronExpression, config.TimeZoneInfo)
    {
        _logger = logger;
        _factory = factory;
    }

    public override Task StartAsync(CancellationToken token)
    {
        _logger.LogInformation("Frequent Users Service started.");
        return base.StartAsync(token);
    }

    public override async Task DoWork(CancellationToken token)
    {
        _logger.LogInformation($"{DateTime.Now:hh:mm:ss}: Computing Frequent Users");
        using (var scope = _factory.CreateAsyncScope())
        {
            var inertia = scope.ServiceProvider.GetService<InertiaService>();
            await inertia!.UpdateFrequentCustomers();
        }
    }

    public override Task StopAsync(CancellationToken token)
    {
        _logger.LogInformation("Frequent Users Service started.");
        return base.StopAsync(token);
    }
}