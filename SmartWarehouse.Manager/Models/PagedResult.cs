namespace SmartWarehouse.Manager.Models;

public sealed class PagedResult<T>
{
    public required IReadOnlyList<T> Data { get; init; }
    public int TotalCount { get; init; }
    public int Page { get; init; }
    public int PageSize { get; init; }
    public int TotalPages { get; init; }
}

