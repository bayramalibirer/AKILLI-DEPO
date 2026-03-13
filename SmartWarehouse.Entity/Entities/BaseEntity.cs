namespace SmartWarehouse.Entity.Entities;

public abstract class BaseEntity
{
    public int Id { get; set; }
    public required string CompanyId { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; set; }
}

