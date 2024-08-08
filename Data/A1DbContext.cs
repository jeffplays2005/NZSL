using Microsoft.EntityFrameworkCore;
using A1_jji134.Models;

namespace A1_jji134.Data
{
    public class A1DbContext : DbContext
    {
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Sign> Signs { get; set; }
    }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source=A1Database.sqlite");
    }
}
