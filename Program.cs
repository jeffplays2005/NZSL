using Microsoft.AspNetCore.Hosting;

namespace A2_jji134
{
    class Program
    {
        static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var app = builder.Build();

            app.Run();
        }
    }
}