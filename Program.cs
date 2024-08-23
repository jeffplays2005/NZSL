using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using A2_jji134.Data;

namespace A2_jji134
{
    class Program
    {
        static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddDbContext<A2DbContext>(options => 
                options.UseSqlite(builder.Configuration["A2DBConnection"])
            );
            builder.Services.AddControllers();
            builder.Services.AddScoped<IA2Repo, A2Repo>();
            builder.Services.AddSwaggerGen();
            var app = builder.Build();
            app.MapControllers();
            if(app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.Run();
        }
    }
}