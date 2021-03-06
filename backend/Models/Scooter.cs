using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using inertia.Enums;
using Microsoft.EntityFrameworkCore;

namespace inertia.Models;

public class Scooter: ISoftDelete
{
    [Key] 
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)] 
    [Required]
    public int ScooterId { get; set; }
    
    [Required]
    public int SoftScooterId { get; set; }

    [Required] public string Name { get; set; } = null!;
    
    [Required] public int DepoId { get; set; }

    [Required] [ForeignKey("DepoId")] public virtual Depo Depo { get; set; } = null!;
    
    [Required] public bool Available { get; set; }
    
    [NotMapped]
    public ScooterStatus ScooterStatus { get; set; }
    
    [Required] public bool SoftDeleted { get; set; }
}