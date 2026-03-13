# Akıllı Depo Yönetimi

Ürün, lokasyon ve stok hareketlerini yöneten tek sayfa (SPA) depo uygulaması. .NET 9 Web API backend ve React 18 + TypeScript frontend ile geliştirilmiştir.

## Özellikler

- Ürün tanımlama, düzenleme ve silme (soft delete)
- Depo lokasyonu ekleme
- Stok giriş/çıkış kaydı (yetersiz stok kontrolü)
- Ürün ve stok hareketi listeleme (server-side pagination, arama ve filtre)
- Çok kiracılı (multi-tenant) yapı; tüm veriler `CompanyId` ile ayrılır

## Teknolojiler

| Katman    | Teknoloji |
|----------|-----------|
| Backend  | .NET 9, ASP.NET Core Web API, Entity Framework Core 9, SQL Server |
| Frontend | React 18, TypeScript, Vite, Material-UI (MUI), MUI X DataGrid, Axios |

## Proje Yapısı

```
smart-warehouse/
├── SmartWarehouse.sln
├── SmartWarehouse.Api/          # Web API
├── SmartWarehouse.Manager/      # İş mantığı
├── SmartWarehouse.Repository/  # Veri erişimi
├── SmartWarehouse.Entity/      # Entity ve DbContext
├── frontend/
│   └── smart-warehouse-ui/     # React SPA
└── CALISMA_RAPORU.md
```

## Çalıştırma

### Gereksinimler

- .NET 9 SDK
- Node.js 18+
- SQL Server veya SQL Server Express

### Backend

1. Connection string'i ayarlayın: `SmartWarehouse.Api/appsettings.Development.json` içinde `ConnectionStrings:Default` (ör. `Server=localhost\SQLEXPRESS;Database=SmartWarehouseDb;...`).

2. Migration uygulayın:
   ```bash
   dotnet tool restore
   dotnet ef database update --project SmartWarehouse.Api --startup-project SmartWarehouse.Api
   ```

3. API'yi başlatın:
   ```bash
   dotnet run --project SmartWarehouse.Api
   ```
   API varsayılan olarak http://localhost:5127 adresinde çalışır.

### Frontend

```bash
cd frontend/smart-warehouse-ui
npm install
npm run dev
```

Tarayıcıda http://localhost:5173 adresini açın. API'nin çalışıyor olduğundan emin olun (CORS, backend aynı makinede 5127 portunda).

## API Özeti

- `POST /api/products/paged` — Ürün listesi (sayfalı, arama)
- `GET /api/products/{id}?companyId=...` — Ürün detay
- `POST /api/products/create` — Ürün ekleme
- `POST /api/products/update` — Ürün güncelleme
- `POST /api/products/delete` — Ürün silme (soft)
- `POST /api/locations/paged` — Lokasyon listesi
- `POST /api/locations/create` — Lokasyon ekleme
- `POST /api/stock-movements/create` — Stok giriş/çıkış
- `POST /api/stock-movements/paged` — Hareket listesi (sayfalı, filtre)

Tüm POST isteklerinde body'de `CompanyId` zorunludur. Production ortamında PUT/DELETE HTTP metodları kullanılmaz; güncelleme ve silme POST endpoint'leri ile yapılır.

## Lisans

Bu proje eğitim / portfolyo amaçlı geliştirilmiştir.
