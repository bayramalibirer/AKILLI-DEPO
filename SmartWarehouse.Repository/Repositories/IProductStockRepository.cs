using SmartWarehouse.Entity.Entities;

namespace SmartWarehouse.Repository.Repositories;

public interface IProductStockRepository
{
    Task<ProductStock?> GetAsync(int productId, int warehouseLocationId, string companyId, CancellationToken ct = default);
    Task<ProductStock> UpsertAsync(ProductStock entity, CancellationToken ct = default);
}

