using SmartWarehouse.Entity.Entities;

namespace SmartWarehouse.Repository.Repositories;

public interface IWarehouseLocationRepository
{
    Task<WarehouseLocation?> GetByIdAsync(int id, string companyId, CancellationToken ct = default);
    Task<WarehouseLocation?> GetByCodeAsync(string locationCode, string companyId, CancellationToken ct = default);
    Task<(IReadOnlyList<WarehouseLocation> Items, int TotalCount)> GetPagedAsync(
        string companyId,
        int page,
        int pageSize,
        string? search,
        CancellationToken ct = default);
    Task<WarehouseLocation> CreateAsync(WarehouseLocation entity, CancellationToken ct = default);
}

