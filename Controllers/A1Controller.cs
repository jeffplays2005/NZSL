using Microsoft.AspNetCore.Mvc;
using A1_jji134.Data;
using A1_jji134.Models;

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

        // Endpoint 1
        [HttpGet("GetVersion")]
        public ActionResult GetVersion()
        {
            return Ok("1.0.0 (Ngāruawāhia) by jji134");
        }

        // Endpoint 2
        [HttpGet("Logo")]
        public ActionResult GetLogo()
        {
            string path = Directory.GetCurrentDirectory();
            string imgDir = Path.Combine(path, "Logos/Logo.png");
            return PhysicalFile(imgDir, "image/png"3);
        }

        // Endpoint 3
        [HttpGet("AllSigns")]
        public ActionResult<IEnumerable<Sign>> GetSigns()
        {
            IEnumerable<Sign> signs = _repository.GetAllSigns();
            return Ok(signs);
        }

        // Endpoint 4
        [HttpGet("Signs/{term}")]
        public ActionResult<IEnumerable<Sign>> GetSign(string term)
        {
            IEnumerable<Sign> signs = _repository.GetAllSigns();
            IEnumerable<Sign> filteredSigns = signs.Where(sign =>
                sign.Description
                .ToLower()
                .Contains(term.ToLower())
            );

            return Ok(filteredSigns);
        }
    }
}
