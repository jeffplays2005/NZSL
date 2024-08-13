using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using A1_jji134.Data;

namespace A1_jji134
{
    class Program
    {
        static void Main(string[] args)
        {  
            var builder = WebApplication.CreateBuilder(args);
            // Registers endpoints that processes code.
            builder.Services.AddControllers();
            /**
            * Register database context.
            * Use builder configuration to fetch database location.
            */
            builder.Services.AddDbContext<A1DbContext>(options => 
                options.UseSqlite(builder.Configuration["P1DBConnection"])
            );
            // Register implementation of A1Repo.
            builder.Services.AddScoped<IA1Repo, A1Repo>();

            var app = builder.Build();
            // app.UseHttpsRedirection();
            // app.UseAuthorization();
            // app.MapControllers();
            app.Run();
        }
    }
}
