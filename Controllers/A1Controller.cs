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
            return PhysicalFile(imgDir, "image/png");
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

        // Endpoint 5
        [HttpGet("SignImage/{id}")]
        public ActionResult GetSignImage(string id)
        {
            string path = Directory.GetCurrentDirectory();
            string imgDir = Path.Combine(path, "SignsImages");

            // All the possible images
            string png = Path.Combine(imgDir, id + ".png");
            string jpg = Path.Combine(imgDir, id + ".jpg");
            string gif = Path.Combine(imgDir, id + ".gif");

            string fileName = Path.Combine(imgDir, "default" + ".png");
            string respHeader = "image/png";

            if (System.IO.File.Exists(png))
            {
                fileName = png;
            }
            else if (System.IO.File.Exists(jpg))
            {
                fileName = jpg;
                respHeader = "image/jpeg";
            }
            else if (System.IO.File.Exists(gif))
            {
                fileName = gif;
                respHeader = "image/gif";
            }
            return PhysicalFile(fileName, respHeader);
        }

        // Endpoint 6
        [HttpGet("GetComment/{id}")]
        public ActionResult<Comment> GetComment(int id)
        {
            Comment comment = _repository.GetCommentByID(id);
            if (comment == null)
            {
                return BadRequest(("Comment {0} does not exist.", id));
            }
            return Ok(comment);
        }
    }
}
