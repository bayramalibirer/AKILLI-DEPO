namespace SmartWarehouse.Api.Dtos;

public sealed class PagedQueryDto
{
    public required string CompanyId { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 25;
    public string? Search { get; set; }
}

