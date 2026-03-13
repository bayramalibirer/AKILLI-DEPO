namespace SmartWarehouse.Api.Dtos;

public sealed class CreateProductDto
{
    public required string CompanyId { get; set; }
    public required string ProductCode { get; set; }
    public required string ProductName { get; set; }
    public string? Description { get; set; }
    public string? Unit { get; set; }
}

public sealed class UpdateProductDto
{
    public required string CompanyId { get; set; }
    public int Id { get; set; }
    public required string ProductName { get; set; }
    public string? Description { get; set; }
    public string? Unit { get; set; }
}

public sealed class DeleteProductDto
{
    public required string CompanyId { get; set; }
    public int Id { get; set; }
}

