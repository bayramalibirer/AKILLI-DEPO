using Microsoft.EntityFrameworkCore;
using SmartWarehouse.Entity;
using SmartWarehouse.Entity.Entities;

namespace SmartWarehouse.Repository.Repositories;

public sealed class ProductStockRepository(SmartWarehouseDbContext context) : IProductStockRepository
{
    public Task<ProductStock?> GetAsync(int productId, int warehouseLocationId, string companyId, CancellationToken ct = default)
        => context.ProductStocks
            .FirstOrDefaultAsync(x =>
                x.CompanyId == companyId &&
                x.ProductId == productId &&
                x.WarehouseLocationId == warehouseLocationId &&
                !x.IsDeleted, ct);

    public async Task<ProductStock> UpsertAsync(ProductStock entity, CancellationToken ct = default)
    {
        if (entity.Id == 0)
        {
            context.ProductStocks.Add(entity);
        }
        else
        {
            entity.UpdatedAtUtc = DateTime.UtcNow;
            context.Entry(entity).State = EntityState.Modified;
        }

        await context.SaveChangesAsync(ct);
        return entity;
    }
}

