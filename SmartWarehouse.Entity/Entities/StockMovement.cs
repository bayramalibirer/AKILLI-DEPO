using SmartWarehouse.Entity.Entities.Enums;

namespace SmartWarehouse.Entity.Entities;

public sealed class StockMovement : BaseEntity
{
    public int ProductId { get; set; }
    public Product? Product { get; set; }

    public int WarehouseLocationId { get; set; }
    public WarehouseLocation? WarehouseLocation { get; set; }

    public StockMovementType MovementType { get; set; }
    public decimal Quantity { get; set; }

    public string? ReferenceNo { get; set; }
    public string? Note { get; set; }
    public DateTime MovementAtUtc { get; set; } = DateTime.UtcNow;
}

