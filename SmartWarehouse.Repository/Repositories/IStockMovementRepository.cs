using SmartWarehouse.Entity.Entities;

namespace SmartWarehouse.Repository.Repositories;

public interface IStockMovementRepository
{
    Task<StockMovement> CreateAsync(StockMovement entity, CancellationToken ct = default);
    Task<(IReadOnlyList<StockMovement> Items, int TotalCount)> GetPagedAsync(
        string companyId,
        int page,
        int pageSize,
        int? productId,
        int? warehouseLocationId,
        CancellationToken ct = default);
}

