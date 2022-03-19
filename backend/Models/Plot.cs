namespace inertia.Models;

public class PlotLine
{
   public string Name { get; set; } = null!;
   public List<float> Values { get; set; } = null!;
}

public class Plot
{
   public List<int> XAxis { get; set; } = null!;
   public List<PlotLine> YAxis { get; set; } = null!;
}