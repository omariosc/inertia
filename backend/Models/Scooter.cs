using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using inertia.Enums;

namespace inertia.Models;

public class Scooter
{
    [Key] 
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)] 
    [Required]
    public int ScooterId { get; set; }

    [Required] public string Name { get; set; } = null!;
    
    [Required] public int DepoId { get; set; }

    [ForeignKey("DepoId")] public virtual Depo Depo { get; set; } = null!;
    
    [Required] public bool Available { get; set; }
    
    [NotMapped]
    public ScooterStatus ScooterStatus { get; set; }
}