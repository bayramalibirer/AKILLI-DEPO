namespace SmartWarehouse.Entity.Entities;

public sealed class Product : BaseEntity
{
    public required string ProductCode { get; set; }
    public required string ProductName { get; set; }

    public string? Description { get; set; }
    public string? Unit { get; set; }
}

