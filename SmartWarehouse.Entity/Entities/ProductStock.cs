namespace SmartWarehouse.Entity.Entities;

public sealed class ProductStock : BaseEntity
{
    public int ProductId { get; set; }
    public Product? Product { get; set; }

    public int WarehouseLocationId { get; set; }
    public WarehouseLocation? WarehouseLocation { get; set; }

    public decimal Quantity { get; set; }
}

