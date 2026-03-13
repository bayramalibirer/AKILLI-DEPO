using SmartWarehouse.Entity.Entities;
using SmartWarehouse.Manager.Guards;
using SmartWarehouse.Manager.Models;
using SmartWarehouse.Repository.Repositories;

namespace SmartWarehouse.Manager.Managers;

public sealed class ProductManager(IProductRepository productRepository)
{
    public Task<Product?> GetByIdAsync(int id, string companyId, CancellationToken ct = default)
        => productRepository.GetByIdAsync(id, companyId, ct);

    public async Task<PagedResult<Product>> GetPagedAsync(
        string companyId,
        int page,
        int pageSize,
        string? search,
        CancellationToken ct = default)
    {
        CompanyIdGuard.Require(companyId);
        page = page < 1 ? 1 : page;
        pageSize = pageSize < 1 ? 25 : pageSize;

        var (items, total) = await productRepository.GetPagedAsync(companyId, page, pageSize, search, ct);
        return new PagedResult<Product>
        {
            Data = items,
            TotalCount = total,
            Page = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling(total / (double)pageSize)
        };
    }

    public async Task<Product> CreateAsync(Product entity, CancellationToken ct = default)
    {
        CompanyIdGuard.Require(entity.CompanyId);
        if (string.IsNullOrWhiteSpace(entity.ProductCode)) throw new ArgumentException("ProductCode is required.");
        if (string.IsNullOrWhiteSpace(entity.ProductName)) throw new ArgumentException("ProductName is required.");

        var existing = await productRepository.GetByCodeAsync(entity.ProductCode.Trim(), entity.CompanyId, ct);
        if (existing != null) throw new InvalidOperationException("ProductCode must be unique per CompanyId.");

        entity.ProductCode = entity.ProductCode.Trim();
        entity.ProductName = entity.ProductName.Trim();

        return await productRepository.CreateAsync(entity, ct);
    }

    public async Task<Product> UpdateAsync(Product entity, CancellationToken ct = default)
    {
        CompanyIdGuard.Require(entity.CompanyId);
        if (entity.Id <= 0) throw new ArgumentException("Id is required.");

        var existing = await productRepository.GetByIdAsync(entity.Id, entity.CompanyId, ct);
        if (existing == null) throw new KeyNotFoundException("Product not found.");

        existing.ProductName = entity.ProductName.Trim();
        existing.Description = entity.Description;
        existing.Unit = entity.Unit;

        return await productRepository.UpdateAsync(existing, ct);
    }

    public async Task SoftDeleteAsync(int id, string companyId, CancellationToken ct = default)
    {
        CompanyIdGuard.Require(companyId);
        var existing = await productRepository.GetByIdAsync(id, companyId, ct);
        if (existing == null) return;
        await productRepository.SoftDeleteAsync(existing, ct);
    }
}

