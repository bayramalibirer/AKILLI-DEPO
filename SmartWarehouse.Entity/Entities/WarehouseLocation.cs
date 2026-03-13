namespace SmartWarehouse.Entity.Entities;

public sealed class WarehouseLocation : BaseEntity
{
    public required string LocationCode { get; set; }
    public required string LocationName { get; set; }

    public string? Zone { get; set; }
    public int? Priority { get; set; }
}

