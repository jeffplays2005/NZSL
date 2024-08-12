using A1_jji134.Data;

namespace A1_jji134
{
    class Program
    {
        static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder()
            builder.Services.addDbContext<A1DbContext>(options => 
                options.UseSqlite(builder.Configuration["WebAPIConnection"])
            );
        }
    }
}
