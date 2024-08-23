
using A2_jji134.Models;

namespace A2_jji134.Data
{
    public class IA2Repo
    {
        // event stuff
        IEnumerable<Event> GetAllEvents();
        Event GetEventById(int id);
        Event AddEvent(Event event);

        // organizer stuff
        IEnumerable<Organizer> GetAllOrganizers();
        Organizer GetOrganizerByName(string name);
        Organizer AddOrganizer(Organizer organizer);

        // Sign stuff
        IEnumerable<Sign> GetAllSigns();
        Sign GetSignById(int id);
        Sign AddSign(Sign sign);

        // User stuff
        IEnumerable<User> GetAllUsers();
        User GetUserByName(string name);
        User AddUser(User user);
    }
}