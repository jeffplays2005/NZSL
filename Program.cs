using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using A2_jji134.Data;
using A2_jji134.Handler;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;

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
            // Auth stuff
            builder.Services.AddAuthentication()
                            .AddScheme<AuthenticationSchemeOptions, A2AuthHandler>("MyAuthentication", null);
            builder.Services.AddAuthorization(options => {
                options.AddPolicy("UserOnly", policy => policy.RequireClaim("user"));
                options.AddPolicy("OrganizerOnly", policy => policy.RequireClaim("organizer"));
                options.AddPolicy("HasAuth", policy => {
                    policy.RequireAssertion(context => 
                        context.User.HasClaim(c =>
                            (c.Type == "user" || c.Type == "organizer")
                        )
                    );
                });
            });
            builder.Services.AddSwaggerGen();
            var app = builder.Build();
            app.UseHttpsRedirection();
            app.MapControllers();
            app.UseAuthentication();
            app.UseAuthorization();
            if(app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.Run();
        }
    }
}