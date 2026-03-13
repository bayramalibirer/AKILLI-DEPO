using Microsoft.EntityFrameworkCore;
using SmartWarehouse.Entity;
using SmartWarehouse.Entity.Entities;

namespace SmartWarehouse.Repository.Repositories;

public sealed class WarehouseLocationRepository(SmartWarehouseDbContext context) : IWarehouseLocationRepository
{
    public Task<WarehouseLocation?> GetByIdAsync(int id, string companyId, CancellationToken ct = default)
        => context.WarehouseLocations.AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id && x.CompanyId == companyId && !x.IsDeleted, ct);

    public Task<WarehouseLocation?> GetByCodeAsync(string locationCode, string companyId, CancellationToken ct = default)
        => context.WarehouseLocations.AsNoTracking()
            .FirstOrDefaultAsync(x => x.CompanyId == companyId && x.LocationCode == locationCode && !x.IsDeleted, ct);

    public async Task<(IReadOnlyList<WarehouseLocation> Items, int TotalCount)> GetPagedAsync(
        string companyId,
        int page,
        int pageSize,
        string? search,
        CancellationToken ct = default)
    {
        var query = context.WarehouseLocations.AsNoTracking()
            .Where(x => x.CompanyId == companyId && !x.IsDeleted);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim();
            query = query.Where(x => x.LocationCode.Contains(s) || x.LocationName.Contains(s) || (x.Zone != null && x.Zone.Contains(s)));
        }

        var total = await query.CountAsync(ct);
        var items = await query
            .OrderByDescending(x => x.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return (items, total);
    }

    public async Task<WarehouseLocation> CreateAsync(WarehouseLocation entity, CancellationToken ct = default)
    {
        context.WarehouseLocations.Add(entity);
        await context.SaveChangesAsync(ct);
        return entity;
    }
}

