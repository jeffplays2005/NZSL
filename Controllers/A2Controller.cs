using A2_jji134.Data;
using A2_jji134.Dtos;
using A2_jji134.Models;
using Microsoft.AspNetCore.Mvc;

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

        [HttpGet("PurchaseSign/{id}")]
        public ActionResult<PurchaseOutputDto> PurchaseSign()
        {

        }
    }
}