using Microsoft.EntityFrameworkCore;
using SmartWarehouse.Entity;
using SmartWarehouse.Entity.Entities;

namespace SmartWarehouse.Repository.Repositories;

public sealed class ProductRepository(SmartWarehouseDbContext context) : IProductRepository
{
    public Task<Product?> GetByIdAsync(int id, string companyId, CancellationToken ct = default)
        => context.Products.AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id && x.CompanyId == companyId && !x.IsDeleted, ct);

    public Task<Product?> GetByCodeAsync(string productCode, string companyId, CancellationToken ct = default)
        => context.Products.AsNoTracking()
            .FirstOrDefaultAsync(x => x.CompanyId == companyId && x.ProductCode == productCode && !x.IsDeleted, ct);

    public async Task<(IReadOnlyList<Product> Items, int TotalCount)> GetPagedAsync(
        string companyId,
        int page,
        int pageSize,
        string? search,
        CancellationToken ct = default)
    {
        var query = context.Products.AsNoTracking()
            .Where(x => x.CompanyId == companyId && !x.IsDeleted);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim();
            query = query.Where(x => x.ProductCode.Contains(s) || x.ProductName.Contains(s));
        }

        var total = await query.CountAsync(ct);
        var items = await query
            .OrderByDescending(x => x.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return (items, total);
    }

    public async Task<Product> CreateAsync(Product entity, CancellationToken ct = default)
    {
        context.Products.Add(entity);
        await context.SaveChangesAsync(ct);
        return entity;
    }

    public async Task<Product> UpdateAsync(Product entity, CancellationToken ct = default)
    {
        entity.UpdatedAtUtc = DateTime.UtcNow;
        context.Entry(entity).State = EntityState.Modified;
        await context.SaveChangesAsync(ct);
        return entity;
    }

    public async Task SoftDeleteAsync(Product entity, CancellationToken ct = default)
    {
        entity.IsDeleted = true;
        entity.UpdatedAtUtc = DateTime.UtcNow;
        context.Entry(entity).State = EntityState.Modified;
        await context.SaveChangesAsync(ct);
    }
}

