using Microsoft.EntityFrameworkCore;
using SmartWarehouse.Entity;
using SmartWarehouse.Entity.Entities;

namespace SmartWarehouse.Repository.Repositories;

public sealed class StockMovementRepository(SmartWarehouseDbContext context) : IStockMovementRepository
{
    public async Task<StockMovement> CreateAsync(StockMovement entity, CancellationToken ct = default)
    {
        context.StockMovements.Add(entity);
        await context.SaveChangesAsync(ct);
        return entity;
    }

    public async Task<(IReadOnlyList<StockMovement> Items, int TotalCount)> GetPagedAsync(
        string companyId,
        int page,
        int pageSize,
        int? productId,
        int? warehouseLocationId,
        CancellationToken ct = default)
    {
        var query = context.StockMovements.AsNoTracking()
            .Where(x => x.CompanyId == companyId && !x.IsDeleted);

        if (productId.HasValue)
            query = query.Where(x => x.ProductId == productId.Value);
        if (warehouseLocationId.HasValue)
            query = query.Where(x => x.WarehouseLocationId == warehouseLocationId.Value);

        var total = await query.CountAsync(ct);
        var items = await query
            .OrderByDescending(x => x.MovementAtUtc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return (items, total);
    }
}

