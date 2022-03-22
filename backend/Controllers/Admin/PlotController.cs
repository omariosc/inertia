using inertia.Authorization;
using inertia.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace inertia.Controllers.Admin;

[ApiController]
[Route("api/admin/[controller]")]
[Produces("application/json")]
[Authorize(Policy = Policies.Employee)]
public class PlotController : MyControllerBase
{
    private readonly InertiaContext _db;

    public PlotController(InertiaContext db)
    {
        _db = db;
    }

    [HttpGet("weekly")]
    public async Task<ActionResult> PlotWeeklyIncome([FromQuery] bool separateHireOptions)
    {
        if (!separateHireOptions)
        {
            var income = await _db.Orders
                .GroupBy(s => s.WeekNumber)
                .Select(s => new
                {
                    s.First().WeekNumber,
                    Income = s.Sum(o => o.Cost)
                })
                .ToListAsync();

            long startWeek = income.First().WeekNumber;
            long endWeek = income.Last().WeekNumber;
            var weekRange = Enumerable.Range((int)startWeek, (int)(endWeek - startWeek + 1));
            Plot plot = new Plot
            {
                XAxis = weekRange.ToList(),
                YAxis = new List<PlotLine>
                {
                    new PlotLine
                    {
                        Name = "income",
                        Values = (
                                from i in weekRange
                                join e in income 
                                    on i equals e.WeekNumber 
                                    into table
                                from e2 in table.DefaultIfEmpty()
                                select e2?.Income ?? 0)
                            .ToList()
                    }
                }
            };

            return Ok(plot);
        }
        else
        {
            var hireOptions = await _db.HireOptions
                .ToListAsync();

            var income = await Task.WhenAll(
                hireOptions
                        .Select(async h => new
                        {
                            Name = h.Name,
                            Income = await _db.Orders
                                .Where(s => s.HireOptionId == h.HireOptionId)
                                .GroupBy(s => s.WeekNumber)
                                .Select(s => new
                                {
                                    s.First().WeekNumber,
                                    Income = s.Sum(o => o.Cost)
                                })
                                .ToListAsync()
                        })
                );

            var orderedWeekNumbers = _db.Orders
                .OrderBy(o => o.WeekNumber)
                .Select(o => o.WeekNumber);
            
            long startWeek = await orderedWeekNumbers.FirstAsync();
            long endWeek = await orderedWeekNumbers.LastAsync();
            var weekRange = Enumerable.Range((int)startWeek, (int)(endWeek - startWeek + 1));
            Plot plot = new Plot
            {
                XAxis = weekRange.ToList(),
                YAxis = (
                    from hireOptionIncome in income
                    select 
                        new PlotLine
                        {
                            Name = hireOptionIncome.Name,
                            Values = (
                                    from i in weekRange
                                    join e in hireOptionIncome.Income 
                                        on i equals e.WeekNumber 
                                        into table
                                    from e2 in table.DefaultIfEmpty()
                                    select e2?.Income ?? 0)
                                .ToList()
                        })
                    .ToList()
            };

            return Ok(plot);
        }
    }

    [HttpGet("combinedDaily")]
    public async Task<ActionResult> PlotCombinedDaily()
    {
        var hireOptions = await _db.HireOptions
            .ToListAsync();

        var income = await Task.WhenAll(
            hireOptions
                .Select(async h => new
                {
                    Name = h.Name,
                    Income = await _db.Orders
                        .Where(s => s.HireOptionId == h.HireOptionId)
                        .GroupBy(s => s.WeekDay)
                        .Select(s => new
                        {
                            s.First().WeekDay,
                            Income = s.Sum(o => o.Cost)
                        })
                        .ToListAsync()
                })
        );

        var weekDays = new List<DayOfWeek>
            {
                DayOfWeek.Monday,
                DayOfWeek.Tuesday,
                DayOfWeek.Wednesday,
                DayOfWeek.Thursday,
                DayOfWeek.Friday,
                DayOfWeek.Saturday,
                DayOfWeek.Sunday,
            };
        
        PlotBarChart plot = new PlotBarChart{
            Tags = weekDays.Select(s => s.ToString()).ToList(),
            BarNames = hireOptions.Select(s => s.Name).ToList(),
            BarData = income.Select( hireOption =>
                    (
                        from d in weekDays
                        join e in hireOption.Income
                            on d equals e.WeekDay
                            into table
                        from e2 in table.DefaultIfEmpty()
                        select e2?.Income ?? 0)
                    .ToList())
                .ToList()
        };

        return Ok(plot);
    }
 }