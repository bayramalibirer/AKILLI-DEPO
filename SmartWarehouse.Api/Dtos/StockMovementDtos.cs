using SmartWarehouse.Entity.Entities.Enums;

namespace SmartWarehouse.Api.Dtos;

public sealed class CreateStockMovementDto
{
    public required string CompanyId { get; set; }
    public int ProductId { get; set; }
    public int WarehouseLocationId { get; set; }
    public StockMovementType MovementType { get; set; }
    public decimal Quantity { get; set; }
    public string? ReferenceNo { get; set; }
    public string? Note { get; set; }
}

public sealed class StockMovementsPagedQueryDto
{
    public required string CompanyId { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 25;
    public int? ProductId { get; set; }
    public int? WarehouseLocationId { get; set; }
}

