using Microsoft.EntityFrameworkCore;

namespace TaskApi.Models;

public class TaskContext : DbContext
{
    public TaskContext(DbContextOptions<TaskContext> options)
        : base(options)
    {
    }

    public DbSet<TaskItem> Tasks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TaskItem>()
            .Property(t => t.Priority)
            .HasConversion<string>();

        modelBuilder.Entity<TaskItem>()
            .Property(t => t.Status)
            .HasConversion<string>();
    }
}