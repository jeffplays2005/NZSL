using Microsoft.EntityFrameworkCore;
using A2_jji134.Models;

namespace A2_jji134.Data 
{
    public class A2DbContext : DbContext
    {
        public A2DbContext(DbContextOptions<A2DbContext> options): base(options){}

        public DbSet<Sign> Signs { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<Organizer> Organizers { get; set; }
    }
}