using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using inertia.Enums;
using Microsoft.EntityFrameworkCore;

namespace inertia.Models;

//[Index(nameof(AccessToken), IsUnique = true)]
[Index(nameof(AccountId), IsUnique = false)]
public class LoginInstance
{
    [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity), Required]
    public int LoginInstanceId { get; set; }

    [Required] public string AccessToken { get; set; } = null!;

    [Required] public DateTime CreatedAt { get; set; }
    
    [Required] public string AccountId { get; set; } = null!;

    [Required] public Account Account { get; set; } = null!;

    [Required] public LoginInstanceState LoginState { get; set; }
}