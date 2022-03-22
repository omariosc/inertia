using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using inertia.Enums;

namespace inertia.Models;

public abstract class AbstractOrder
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Key, Required]
    public string OrderId { get; set; } = null!;
    
    [Required] public int ScooterId { get; set; }
    [ForeignKey("ScooterId")] public virtual Scooter Scooter { get; set; } = null!;
    [Required] public DateTime StartTime { get; set; }
    [Required] public DateTime EndTime { get; set; }
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
    
    [Required] public int HireOptionId { get; set; }
    [ForeignKey("HireOptionId")] public virtual HireOption HireOption { get; set; } = null!;
    
    [Required] public OrderState OrderState { get; set; }

    [JsonIgnore]
    public string? ExtendsId { get; set; } = null!;
    [ForeignKey("ExtendsId")]
    [JsonIgnore]
    public virtual AbstractOrder? Extends { get; set; } = null;

    public ICollection<AbstractOrder>? Extensions { get; set; } = null;
    
    [NotMapped]
    private const long _secondsInWeek = 604800;
}