using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.InteropServices;
using inertia.Enums;

namespace inertia.Models;

public class Issue
{
    [Key, Required] public int IssueId { get; set; }
    [Required] public IssuePriority Priority { get; set; }

    [Required] public string Title { get; set; } = null!;
    [Required] public string Content { get; set; } = null!;
    
    [Required] public string AccountId { get; set; } = null!;
    [ForeignKey("AccountId")] public virtual Account Account { get; set; } = null!;

    [Required] public DateTime DateOpened { get; set; }
    
    public string? Resolution { get; set; }
}