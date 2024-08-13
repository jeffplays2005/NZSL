using Microsoft.AspNetCore.Mvc;
using A1_jji134.Data;

namespace A1_jji134.Controllers
{
    [Route("webapi")]
    [ApiController]
    public class A1Controller : Controller
    {
        private readonly IA1Repo _repository;

        public A1Controller(IA1Repo repository)
        {
            _repository = repository;
        }

        [HttpGet("GetVersion")]
        public ActionResult GetVersion()
        {
            return Ok("1.0.0 (Ngāruawāhia) by jji134");
        }

        [HttpGet("Logo")]
        public ActionResult GetLogo()
        {
            string path = Directory.GetCurrentDirectory();
            string imgDir = Path.Combine(path, "Logos");
            string fileName = Path.Combine(imgDir, "Logo" + ".png");

            string respHeader = "image/png";
            return PhysicalFile(fileName, respHeader);
        }
    }
}
