using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace inertia.Models;

public class Scooter
{
    [Key] 
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)] 
    [Required]
    public int ScooterId { get; set; }

    [Required] public int DepoId { get; set; }

    [ForeignKey("DepoId")]
    public virtual Depo Depo { get; set; }
    
    [Required]
    public bool Available { get; set; }
}