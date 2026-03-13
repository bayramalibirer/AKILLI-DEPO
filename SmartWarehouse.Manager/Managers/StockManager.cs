using SmartWarehouse.Entity.Entities;
using SmartWarehouse.Entity.Entities.Enums;
using SmartWarehouse.Manager.Guards;
using SmartWarehouse.Manager.Models;
using SmartWarehouse.Repository.Repositories;

namespace SmartWarehouse.Manager.Managers;

public sealed class StockManager(
    IProductRepository productRepository,
    IWarehouseLocationRepository locationRepository,
    IProductStockRepository productStockRepository,
    IStockMovementRepository movementRepository)
{
    public async Task<StockMovement> RegisterMovementAsync(
        string companyId,
        int productId,
        int warehouseLocationId,
        StockMovementType movementType,
        decimal quantity,
        string? referenceNo,
        string? note,
        CancellationToken ct = default)
    {
        CompanyIdGuard.Require(companyId);
        if (productId <= 0) throw new ArgumentException("ProductId is required.");
        if (warehouseLocationId <= 0) throw new ArgumentException("WarehouseLocationId is required.");
        if (quantity <= 0) throw new ArgumentException("Quantity must be > 0.");

        var product = await productRepository.GetByIdAsync(productId, companyId, ct);
        if (product == null) throw new KeyNotFoundException("Product not found.");

        var location = await locationRepository.GetByIdAsync(warehouseLocationId, companyId, ct);
        if (location == null) throw new KeyNotFoundException("WarehouseLocation not found.");

        var stock = await productStockRepository.GetAsync(productId, warehouseLocationId, companyId, ct)
                    ?? new ProductStock
                    {
                        CompanyId = companyId,
                        ProductId = productId,
                        WarehouseLocationId = warehouseLocationId,
                        Quantity = 0
                    };

        var delta = movementType == StockMovementType.In ? quantity : -quantity;
        var nextQty = stock.Quantity + delta;
        if (nextQty < 0) throw new InvalidOperationException("Insufficient stock.");

        stock.Quantity = nextQty;
        await productStockRepository.UpsertAsync(stock, ct);

        var movement = new StockMovement
        {
            CompanyId = companyId,
            ProductId = productId,
            WarehouseLocationId = warehouseLocationId,
            MovementType = movementType,
            Quantity = quantity,
            ReferenceNo = referenceNo,
            Note = note,
            MovementAtUtc = DateTime.UtcNow
        };

        return await movementRepository.CreateAsync(movement, ct);
    }

    public async Task<PagedResult<StockMovement>> GetMovementsPagedAsync(
        string companyId,
        int page,
        int pageSize,
        int? productId,
        int? warehouseLocationId,
        CancellationToken ct = default)
    {
        CompanyIdGuard.Require(companyId);
        page = page < 1 ? 1 : page;
        pageSize = pageSize < 1 ? 25 : pageSize;

        var (items, total) = await movementRepository.GetPagedAsync(companyId, page, pageSize, productId, warehouseLocationId, ct);
        return new PagedResult<StockMovement>
        {
            Data = items,
            TotalCount = total,
            Page = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling(total / (double)pageSize)
        };
    }
}

