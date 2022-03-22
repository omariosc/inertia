using System.ComponentModel.DataAnnotations;

namespace inertia.Models;

public class GuestOrder : AbstractOrder
{
    [Required] public string Email { get; set; } = null!;
    [Required] public string PhoneNumber { get; set; } = null!;
}