using SmartWarehouse.Entity.Entities;

namespace SmartWarehouse.Repository.Repositories;

public interface IProductRepository
{
    Task<Product?> GetByIdAsync(int id, string companyId, CancellationToken ct = default);
    Task<Product?> GetByCodeAsync(string productCode, string companyId, CancellationToken ct = default);

    Task<(IReadOnlyList<Product> Items, int TotalCount)> GetPagedAsync(
        string companyId,
        int page,
        int pageSize,
        string? search,
        CancellationToken ct = default);

    Task<Product> CreateAsync(Product entity, CancellationToken ct = default);
    Task<Product> UpdateAsync(Product entity, CancellationToken ct = default);
    Task SoftDeleteAsync(Product entity, CancellationToken ct = default);
}

