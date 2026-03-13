using Microsoft.AspNetCore.Mvc;
using SmartWarehouse.Api.Dtos;
using SmartWarehouse.Entity.Entities;
using SmartWarehouse.Manager.Managers;

namespace SmartWarehouse.Api.Controllers;

[ApiController]
[Route("api/locations")]
public sealed class LocationsController(LocationManager manager) : ControllerBase
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

    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] CreateLocationDto dto, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(dto.CompanyId)) return BadRequest(new { success = false, message = "CompanyId is required." });

        var created = await manager.CreateAsync(new WarehouseLocation
        {
            CompanyId = dto.CompanyId,
            LocationCode = dto.LocationCode,
            LocationName = dto.LocationName,
            Zone = dto.Zone,
            Priority = dto.Priority
        }, ct);

        return Ok(new { success = true, data = created });
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
}

