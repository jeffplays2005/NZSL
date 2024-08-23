using Microsoft.EntityFrameworkCore.ChangeTracking;
using A2_jji134.Models;

namespace A2_jji134.Data
{
    public class A2Repo : IA2Repo
    {
        private readonly A2DbContext _dbContext;
        public A2Repo(A2DbContext dbContext)
        {
            _dbContext = dbContext;
        }
        // Event stuff
        public IEnumerable<Event> GetAllEvents()
        {
            return _dbContext.Events.ToList();
        }
        public Event GetEventById(int id){
            return _dbContext.Events.FirstOrDefault(c => c.Id == id);
        }
        public Event AddEvent(Event newEvent){
            EntityEntry<Event> e = _dbContext.Events.Add(newEvent);
            Event ee = e.Entity;
            _dbContext.SaveChanges();
            return ee;
        }
        // Organizer stuff
        public IEnumerable<Organizer> GetAllOrganizers()
        {
            return _dbContext.Organizers.ToList();
        }
        public Organizer GetOrganizerByName(string name){
            return _dbContext.Organizers.FirstOrDefault(c => c.Name == name);
        }
        public Organizer AddOrganizer(Organizer newOrganizer){
            EntityEntry<Organizer> e = _dbContext.Organizers.Add(newOrganizer);
            Organizer ee = e.Entity;
            _dbContext.SaveChanges();
            return ee;
        }
        // Sign stuff
        public IEnumerable<Sign> GetAllSigns()
        {
            return _dbContext.Signs.ToList();
        }
        public Sign GetSignById(string id){
            return _dbContext.Signs.FirstOrDefault(c => c.Id == id);
        }
        public Sign AddSign(Sign newSign){
            EntityEntry<Sign> e = _dbContext.Signs.Add(newSign);
            Sign ee = e.Entity;
            _dbContext.SaveChanges();
            return ee;
        }
        // user stuff
        public IEnumerable<User> GetAllUsers()
        {
            return _dbContext.Users.ToList();
        }
        public User GetUserByName(string name){
            return _dbContext.Users.FirstOrDefault(c => c.UserName == name);
        }
        public User AddUser(User newUser){
            EntityEntry<User> e = _dbContext.Users.Add(newUser);
            User ee = e.Entity;
            _dbContext.SaveChanges();
            return ee;
        }
    }
}