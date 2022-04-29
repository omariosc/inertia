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

    // [Required, DataType(DataType.PhoneNumber)] public string PhoneNumber { get; set; } = null!;
    
    [Required, Newtonsoft.Json.JsonIgnore] public string Password { get; set; } = null!;

    [Required, Newtonsoft.Json.JsonIgnore] public string Salt { get; set; } = null!;
    
    [Required] public AccountRole Role { get; set; } 

    [Required] public AccountState State { get; set; }
    
    [Required] public UserType UserType { get; set; }
}