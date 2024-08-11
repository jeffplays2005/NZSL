using Microsoft.AspNetCore.Mvc;

namespace A1_jji134.Controllers
{
    [Route("webapi")]
    [ApiController]
    public class A1Controller : Controller
    {
        private readonly IWebAPIRepo _repository;
        public A1Controller(IWebAPIRepo repository)
        {
            _repository = repository;
        }
    }
}