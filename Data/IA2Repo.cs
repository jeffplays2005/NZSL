
using A2_jji134.Models;

namespace A2_jji134.Data
{
    public interface IA2Repo
    {
        // event stuff
        IEnumerable<Event> GetAllEvents();
        Event GetEventById(int id);
        Event AddEvent(Event newEvent);

        // organizer stuff
        IEnumerable<Organizer> GetAllOrganizers();
        Organizer GetOrganizerByName(string name);
        Organizer AddOrganizer(Organizer newOrganizer);

        // Sign stuff
        IEnumerable<Sign> GetAllSigns();
        Sign GetSignById(string id);
        Sign AddSign(Sign newSign);

        // User stuff
        IEnumerable<User> GetAllUsers();
        User GetUserByName(string name);
        User AddUser(User newUser);
    }
}