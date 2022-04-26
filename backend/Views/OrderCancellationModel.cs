namespace inertia.Views;

public class OrderCancellationModel
{
    public string Name { get; set; } = null!;
    public int ScooterId { get; set; }
    public int DepoId { get; set; }
    public string OrderId { get; set; } = null!;
    public float PreDiscountCost { get; set; }
    public float Discount { get; set; }
    public float Cost { get; set; }
    public string HireOptionName { get; set; } = null!;
}