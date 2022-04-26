using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using inertia.Enums;
using Newtonsoft.Json;

namespace inertia.Models;

public class Order
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Key, Required]
    public string OrderId { get; set; } = null!;
    
    [Required] public int ScooterId { get; set; }
    [ForeignKey("ScooterId")] public virtual Scooter Scooter { get; set; } = null!;
    [Required] public DateTime CreatedAt { get; set; }
    [Required] public DateTime StartTime { get; set; }
    [Required] public DateTime EndTime { get; set; }
    [Required] public double BookTime {
        get => (EndTime - StartTime).TotalHours;
        set{} }
    [Required] public long WeekNumber {
        get
        {
            if (Extends is null)
                return new DateTimeOffset(StartTime).ToUnixTimeSeconds() / _secondsInWeek;
            return Extends.WeekNumber;
        }
        set { }
    }

    [Required] public DayOfWeek WeekDay
    {
        get
        {
            if (Extends is null)
                return StartTime.DayOfWeek;
            return Extends.WeekDay;
        }
        set { }
    }

    [Required] public float Cost { get; set; }
    
    [Required] public float PreDiscountCost { get; set; }
    
    [Required] public float Discount { get; set; }
    
    [Required] public int HireOptionId { get; set; }
    [ForeignKey("HireOptionId")] public virtual HireOption HireOption { get; set; } = null!;
    
    [Required] public OrderState OrderState { get; set; }

    [JsonIgnore]
    public string? ExtendsId { get; set; } = null!;
    [ForeignKey("ExtendsId")]
    [JsonIgnore]
    public virtual Order? Extends { get; set; } = null;

    public ICollection<Order>? Extensions { get; set; } = null;

    [Required] public string AccountId { get; set; } = null!;
    [JsonIgnore][ForeignKey("AccountId")] public virtual Account Account { get; set; } = null!;
    
    [NotMapped]
    private const long _secondsInWeek = 604800;
}