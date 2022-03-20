using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

using inertia.Enums;

namespace inertia.Models;


[Index(nameof(Email), IsUnique = true)]
public class Account
{
    [Key, Required] public string AccountId { get; set; } = null!;

    [Required] public string Name { get; set; } = null!;

    [Required, EmailAddress] public string Email { get; set; } = null!;
    
    [Required, JsonIgnore] public string Password { get; set; } = null!;

    [Required, JsonIgnore] public string Salt { get; set; } = null!;
    
    [Required] public AccountRole Role { get; set; } 

    [Required] public AccountState State { get; set; }
    
    [Required] public UserType UserType { get; set; }
}