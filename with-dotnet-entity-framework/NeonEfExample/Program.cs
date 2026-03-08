using Microsoft.EntityFrameworkCore;
using NeonEfExample.Data;

// Get Lakebase connection string at startup (short-lived token from Databricks).
var connectionString = NeonEfExample.LakebaseAuth.GetConnectionStringAsync()
    .GetAwaiter().GetResult();

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseAuthorization();
app.MapControllers();

if (app.Environment.IsDevelopment())
{
    app.Run("http://localhost:5001");
}
else
{
    app.UseHttpsRedirection();
    app.Run();
}
