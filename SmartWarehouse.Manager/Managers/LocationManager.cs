using SmartWarehouse.Entity.Entities;
using SmartWarehouse.Manager.Guards;
using SmartWarehouse.Manager.Models;
using SmartWarehouse.Repository.Repositories;

namespace SmartWarehouse.Manager.Managers;

public sealed class LocationManager(IWarehouseLocationRepository repository)
{
    public async Task<PagedResult<WarehouseLocation>> GetPagedAsync(
        string companyId,
        int page,
        int pageSize,
        string? search,
        CancellationToken ct = default)
    {
        CompanyIdGuard.Require(companyId);
        page = page < 1 ? 1 : page;
        pageSize = pageSize < 1 ? 25 : pageSize;

        var (items, total) = await repository.GetPagedAsync(companyId, page, pageSize, search, ct);
        return new PagedResult<WarehouseLocation>
        {
            Data = items,
            TotalCount = total,
            Page = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling(total / (double)pageSize)
        };
    }

    public async Task<WarehouseLocation> CreateAsync(WarehouseLocation entity, CancellationToken ct = default)
    {
        CompanyIdGuard.Require(entity.CompanyId);
        if (string.IsNullOrWhiteSpace(entity.LocationCode)) throw new ArgumentException("LocationCode is required.");
        if (string.IsNullOrWhiteSpace(entity.LocationName)) throw new ArgumentException("LocationName is required.");

        var existing = await repository.GetByCodeAsync(entity.LocationCode.Trim(), entity.CompanyId, ct);
        if (existing != null) throw new InvalidOperationException("LocationCode must be unique per CompanyId.");

        entity.LocationCode = entity.LocationCode.Trim();
        entity.LocationName = entity.LocationName.Trim();
        return await repository.CreateAsync(entity, ct);
    }

    public Task<WarehouseLocation?> GetByIdAsync(int id, string companyId, CancellationToken ct = default)
        => repository.GetByIdAsync(id, companyId, ct);
}

