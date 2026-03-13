using Microsoft.AspNetCore.Mvc;
using SmartWarehouse.Api.Dtos;
using SmartWarehouse.Manager.Managers;

namespace SmartWarehouse.Api.Controllers;

[ApiController]
[Route("api/stock-movements")]
public sealed class StockMovementsController(StockManager manager) : ControllerBase
{
    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] CreateStockMovementDto dto, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(dto.CompanyId)) return BadRequest(new { success = false, message = "CompanyId is required." });

        try
        {
            var created = await manager.RegisterMovementAsync(
                dto.CompanyId,
                dto.ProductId,
                dto.WarehouseLocationId,
                dto.MovementType,
                dto.Quantity,
                dto.ReferenceNo,
                dto.Note,
                ct);

            return Ok(new { success = true, data = created });
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("Insufficient stock", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new { success = false, message = "Yetersiz stok. Önce bu ürün/lokasyon için stok girişi yapın." });
        }
    }

    [HttpPost("paged")]
    public async Task<IActionResult> GetPaged([FromBody] StockMovementsPagedQueryDto dto, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(dto.CompanyId)) return BadRequest(new { success = false, message = "CompanyId is required." });

        var result = await manager.GetMovementsPagedAsync(dto.CompanyId, dto.Page, dto.PageSize, dto.ProductId, dto.WarehouseLocationId, ct);
        return Ok(new
        {
            success = true,
            data = result.Data,
            totalCount = result.TotalCount,
            page = result.Page,
            pageSize = result.PageSize,
            totalPages = result.TotalPages
        });
    }
}

