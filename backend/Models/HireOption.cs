using System.ComponentModel.DataAnnotations;

namespace inertia.Models;

public class HireOption: ISoftDelete
{
    [Key, Required] public int HireOptionId { get; set; }

    [Required] public int DurationInHours { get; set; }
    
    [Required] public string Name { get; set; } = null!;
    
    [Required] public float Cost { get; set; }
    
    [Required] public bool SoftDeleted { get; set; }
}