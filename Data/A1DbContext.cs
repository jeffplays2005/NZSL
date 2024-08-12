using Microsoft.EntityFrameworkCore;
using A1_jji134.Models;

namespace A1_jji134.Data
{
    public class A1DbContext : DbContext
    {
        // A1DbContext Constructor
        public A1DbContext(DbContextOptions<A1DbContext> options) : base(options) {}

        /**
        * Comments database set.
        */
        public DbSet<Comment> Comments { get; set; }
        /**
        * Signs database set.
        */
        public DbSet<Sign> Signs { get; set; }

        // protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        // {
        //     optionsBuilder.UseSqlite("Data Source=A1Database.sqlite");
        // }
    }
}
