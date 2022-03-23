namespace inertia.Views;

public class OrderConfirmationModel
{
    public int ScooterId { get; set; }
    public int DepoId { get; set; }
    public string OrderId { get; set; } = null!;
    public float Cost { get; set; }
    public string HireOptionName { get; set; } = null!;
}