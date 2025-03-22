namespace TaskApi.Models;

public class TaskItem
{
  public long Id { get; set; }
  public string Title { get; set; } = string.Empty;
  public DateTime? DueDate { get; set; }
  public string Priority { get; set; } = "Low";
  // This will be Low, Medium, or High
  public string Status { get; set; } = "Pending";
  // This will be Pending, InProgress, Completed
  public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime? UpdatedAt { get; set; } = DateTime.UtcNow;
}