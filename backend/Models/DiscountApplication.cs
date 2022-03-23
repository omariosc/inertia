using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using inertia.Enums;
using Microsoft.EntityFrameworkCore;

namespace inertia.Models;

[Index(nameof(AccountId), IsUnique = true)]
public class DiscountApplication
{
    [Required, Key] public int DiscountApplicationId { get; set; }
    [Required] public string AccountId { get; set; } = null!;
    [ForeignKey("AccountId")] public virtual Account Account { get; set; } = null!;
    [Required] public UserType DisccountType { get; set; }
    [Required] public DiscountApplicationState State { get; set; }
    [JsonIgnore] public byte[]? Image { get; set; }
}