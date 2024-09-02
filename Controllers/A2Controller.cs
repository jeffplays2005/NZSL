using A2_jji134.Data;
using A2_jji134.Dtos;
using A2_jji134.Models;
using A2_jji134.Handler;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Globalization;

namespace A2_jji134.Controllers
{
    [Route("webapi")]
    [ApiController]
    public class A2Controller : Controller
    {
        private readonly IA2Repo _repo;
        public A2Controller(IA2Repo repo)
        {
            _repo = repo;
        }
        [HttpPost("Register")]
        public ActionResult Register(User user)
        {
            // Check if already is a user
            User userCheck = _repo.GetUserByName(user.UserName);
            if (userCheck == null)
            {
                _repo.AddUser(user);
                return Ok("User successfully registered.");
            } else {
                return Ok($"UserName {user.UserName} is not available.");
            }
        }
        [Authorize(AuthenticationSchemes = "MyAuthentication")]
        [Authorize(Policy = "UserOnly")]
        [HttpGet("PurchaseSign/{id}")]
        public ActionResult<PurchaseOutputDto> PurchaseSign(string id)
        {
            ClaimsIdentity ci = HttpContext.User.Identities.FirstOrDefault();
            Claim c = ci.FindFirst("user");
            string username = c.Value;
            User customer = _repo.GetUserByName(username);

            // Now check the sign
            Sign lookupSign = _repo.GetSignById(id);
            if(lookupSign == null)
            {
                return BadRequest($"Sign {id} not found");
            }
            return new PurchaseOutputDto{
                UserName = username,
                SignID = lookupSign.Id
            };
        }
        [Authorize(AuthenticationSchemes = "MyAuthentication")]
        [Authorize(Policy = "OrganizerOnly")]
        [HttpPost("AddEvent")]
        public ActionResult AddEvent(EventInputDto newEvent)
        {
            ClaimsIdentity ci = HttpContext.User.Identities.FirstOrDefault();
            Claim c = ci.FindFirst("organizer");
            string username = c.Value;
            Organizer organizer = _repo.GetOrganizerByName(username);
            DateTime startDate;
            DateTime endDate;
            bool worksStart = DateTime.TryParseExact(newEvent.start, "yyyyMMddTHHmmssZ", CultureInfo.InvariantCulture, DateTimeStyles.None, out startDate);
            bool worksEnd = DateTime.TryParseExact(newEvent.end, "yyyyMMddTHHmmssZ", CultureInfo.InvariantCulture, DateTimeStyles.None, out endDate);
            if(!worksStart || !worksEnd)
            {
                return BadRequest("The format of Start and End should be yyyyMMddTHHmmssZ.");
            }
            Event actualEvent = new Event{
                Start=startDate.ToString("yyyyMMddTHHmmssZ"),
                End=endDate.ToString("yyyyMMddTHHmmssZ"),
                Summary=newEvent.summary,
                Description=newEvent.description,
                Location=newEvent.location
            };
            _repo.AddEvent(actualEvent);
            return Ok("Success");

        }
        [Authorize(AuthenticationSchemes = "MyAuthentication")]
        [Authorize(Policy = "HasAuth")]
        [HttpPost("EventCount")]
        public ActionResult EventCount()
        {
            return Ok(_repo.GetAllEvents().Count());
        }
        [Authorize(AuthenticationSchemes = "MyAuthentication")]
        [Authorize(Policy = "HasAuth")]
        [HttpGet("Event/{id}")]
        public ActionResult GetEvent(int id)
        {
            Event foundEvent = _repo.GetEventById(id);
            if(foundEvent == null){
                return BadRequest($"Event {id} does not exist." );
            }
            return Ok("ee");
        }
    }
}