using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace NeonEfExample.Data;

/// <summary>
/// Used by EF Core tools (e.g. dotnet ef database update) to create a DbContext at design time.
/// Uses Lakebase env vars to obtain a connection string.
/// </summary>
public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var connectionString = NeonEfExample.LakebaseAuth.GetConnectionStringAsync()
            .GetAwaiter().GetResult();

        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        optionsBuilder.UseNpgsql(connectionString);

        return new ApplicationDbContext(optionsBuilder.Options);
    }
}
