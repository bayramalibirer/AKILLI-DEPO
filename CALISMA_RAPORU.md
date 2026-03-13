# Çalışma Raporu

## Özet

Akıllı Depo Yönetimi modülü .NET 9 Web API ve React 18 + TypeScript ile tek sayfa (SPA) olarak geliştirildi. Çok kiracılı yapı (`CompanyId`), soft delete (`IsDeleted`), Entity Framework Core ile SQL Server ve server-side pagination kullanıldı. Katmanlı mimari (Controller → Manager → Repository → Entity) uygulandı.

## Kullanılan Teknolojiler

- Backend: .NET 9.0, ASP.NET Core Web API, Entity Framework Core 9.0.3 (SQL Server)
- Frontend: React 18, TypeScript, Vite, Material-UI (MUI), MUI X DataGrid, Axios
- Veritabanı: MS SQL Server (EF Core migrations ile)

## Karşılaşılan Sorunlar ve Çözümler

- **EF Core sürüm uyumu**: .NET 9 ile uyumlu EF Core 9.0.x sürümü kullanıldı.
- **Migration**: `dotnet-ef` yerel tool olarak eklendi; migration'lar API projesi üzerinden yönetildi.
- **CORS**: Frontend (localhost:5173) ile API (localhost:5127) arası istekler için CORS politikası eklendi.
- **Forbid() 500 hatası**: Authentication şeması olmadığı için `Forbid()` yerine `StatusCode(403)` kullanıldı.

## Mimari Kararlar

- **Katmanlı mimari**: Controller → Manager → Repository → Entity; iş kuralları Manager'da, veri erişimi Repository'de.
- **Multi-tenant**: Tüm entity'lerde `CompanyId`; endpoint'lerde filtreleme ve yetki kontrolü.
- **Soft delete**: `IsDeleted` alanı; listeleme ve sorgularda filtreleniyor.
- **Server-side pagination**: Listeleme endpoint'lerinde `Skip`/`Take` ve `totalCount`; frontend sayfalama ile uyumlu.
- **Adlandırma**: Backend PascalCase, frontend camelCase; API istek/yanıt body'de PascalCase, frontend'de camelCase'e dönüştürülüyor.

