using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace inertia.Models;

public class Depo: ISoftDelete
{
    [Key] 
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)] 
    [Required]
    public int DepoId { get; set; }

    [Required] public string Name { get; set; } = null!;
    [Required] public float Latitude { get; set; }
    [Required] public float Longitude { get; set; }

    [Required] public string Address { get; set; } = null!;
    
    [Required] public bool SoftDeleted { get; set; }
}