using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace inertia.Models;

public class Order : AbstractOrder
{
    [Required] public string AccountId { get; set; } = null!;
    [JsonIgnore][ForeignKey("AccountId")] public virtual Account Account { get; set; } = null!;
}