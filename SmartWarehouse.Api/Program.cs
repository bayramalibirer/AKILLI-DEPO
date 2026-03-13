using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<SmartWarehouse.Entity.SmartWarehouseDbContext>(options =>
{
    var cs = builder.Configuration.GetConnectionString("Default");
    options.UseSqlServer(cs, b => b.MigrationsAssembly("SmartWarehouse.Api"));
});

builder.Services.AddScoped<SmartWarehouse.Repository.Repositories.IProductRepository, SmartWarehouse.Repository.Repositories.ProductRepository>();
builder.Services.AddScoped<SmartWarehouse.Repository.Repositories.IWarehouseLocationRepository, SmartWarehouse.Repository.Repositories.WarehouseLocationRepository>();
builder.Services.AddScoped<SmartWarehouse.Repository.Repositories.IProductStockRepository, SmartWarehouse.Repository.Repositories.ProductStockRepository>();
builder.Services.AddScoped<SmartWarehouse.Repository.Repositories.IStockMovementRepository, SmartWarehouse.Repository.Repositories.StockMovementRepository>();

builder.Services.AddScoped<SmartWarehouse.Manager.Managers.ProductManager>();
builder.Services.AddScoped<SmartWarehouse.Manager.Managers.StockManager>();
builder.Services.AddScoped<SmartWarehouse.Manager.Managers.LocationManager>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseHttpsRedirection();

app.MapControllers();

app.Run();
