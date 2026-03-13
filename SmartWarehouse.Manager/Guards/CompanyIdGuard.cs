namespace SmartWarehouse.Manager.Guards;

public static class CompanyIdGuard
{
    public static void Require(string? companyId)
    {
        if (string.IsNullOrWhiteSpace(companyId))
            throw new ArgumentException("CompanyId is required.", nameof(companyId));
    }
}

