using Microsoft.AspNetCore.Mvc;
using SmartWarehouse.Api.Dtos;
using SmartWarehouse.Entity.Entities;
using SmartWarehouse.Manager.Managers;

namespace SmartWarehouse.Api.Controllers;

[ApiController]
[Route("api/products")]
public sealed class ProductsController(ProductManager manager) : ControllerBase
{
    [HttpPost("paged")]
    public async Task<IActionResult> GetPaged([FromBody] PagedQueryDto dto, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(dto.CompanyId)) return BadRequest(new { success = false, message = "CompanyId is required." });
        var result = await manager.GetPagedAsync(dto.CompanyId, dto.Page, dto.PageSize, dto.Search, ct);
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

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, [FromQuery] string companyId, CancellationToken ct)
    {
        companyId = companyId?.Trim();
        if (string.IsNullOrWhiteSpace(companyId)) return BadRequest(new { success = false, message = "CompanyId is required." });

        var entity = await manager.GetByIdAsync(id, companyId, ct);
        if (entity == null) return NotFound();
        if (!string.Equals(entity.CompanyId, companyId, StringComparison.OrdinalIgnoreCase)) return StatusCode(403, new { success = false, message = "Forbidden." });
        return Ok(entity);
    }

    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] CreateProductDto dto, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(dto.CompanyId)) return BadRequest(new { success = false, message = "CompanyId is required." });

        var created = await manager.CreateAsync(new Product
        {
            CompanyId = dto.CompanyId,
            ProductCode = dto.ProductCode,
            ProductName = dto.ProductName,
            Description = dto.Description,
            Unit = dto.Unit
        }, ct);

        return Ok(new { success = true, data = created });
    }

    [HttpPost("update")]
    public async Task<IActionResult> Update([FromBody] UpdateProductDto dto, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(dto.CompanyId)) return BadRequest(new { success = false, message = "CompanyId is required." });

        try
        {
            var updated = await manager.UpdateAsync(new Product
            {
                CompanyId = dto.CompanyId,
                Id = dto.Id,
                ProductCode = "IGNORE",
                ProductName = dto.ProductName,
                Description = dto.Description,
                Unit = dto.Unit
            }, ct);

            return Ok(new { success = true, data = updated });
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpPost("delete")]
    public async Task<IActionResult> Delete([FromBody] DeleteProductDto dto, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(dto.CompanyId)) return BadRequest(new { success = false, message = "CompanyId is required." });
        await manager.SoftDeleteAsync(dto.Id, dto.CompanyId, ct);
        return Ok(new { success = true });
    }
}

