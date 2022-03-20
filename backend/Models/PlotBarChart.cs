namespace inertia.Models;

public class PlotBarChart
{
    public List<String> Tags { get; set; } = null!;
    public List<String> BarNames { get; set; } = null!;
    public List<List<float>> BarData { get; set; } = null!;
}