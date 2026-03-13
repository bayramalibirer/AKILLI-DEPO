using Microsoft.EntityFrameworkCore;
using SmartWarehouse.Entity.Entities;

namespace SmartWarehouse.Entity;

public sealed class SmartWarehouseDbContext(DbContextOptions<SmartWarehouseDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();
    public DbSet<WarehouseLocation> WarehouseLocations => Set<WarehouseLocation>();
    public DbSet<ProductStock> ProductStocks => Set<ProductStock>();
    public DbSet<StockMovement> StockMovements => Set<StockMovement>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Product>(e =>
        {
            e.HasIndex(x => new { x.CompanyId, x.ProductCode }).IsUnique();
            e.Property(x => x.ProductCode).HasMaxLength(64);
            e.Property(x => x.ProductName).HasMaxLength(256);
        });

        modelBuilder.Entity<WarehouseLocation>(e =>
        {
            e.HasIndex(x => new { x.CompanyId, x.LocationCode }).IsUnique();
            e.Property(x => x.LocationCode).HasMaxLength(64);
            e.Property(x => x.LocationName).HasMaxLength(256);
            e.Property(x => x.Zone).HasMaxLength(64);
        });

        modelBuilder.Entity<ProductStock>(e =>
        {
            e.HasIndex(x => new { x.CompanyId, x.ProductId, x.WarehouseLocationId }).IsUnique();
            e.Property(x => x.Quantity).HasPrecision(18, 3);
        });

        modelBuilder.Entity<StockMovement>(e =>
        {
            e.HasIndex(x => new { x.CompanyId, x.ProductId, x.WarehouseLocationId, x.MovementAtUtc });
            e.Property(x => x.Quantity).HasPrecision(18, 3);
            e.Property(x => x.ReferenceNo).HasMaxLength(64);
        });
    }
}

