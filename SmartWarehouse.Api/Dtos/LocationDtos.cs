namespace SmartWarehouse.Api.Dtos;

public sealed class CreateLocationDto
{
    public required string CompanyId { get; set; }
    public required string LocationCode { get; set; }
    public required string LocationName { get; set; }
    public string? Zone { get; set; }
    public int? Priority { get; set; }
}

