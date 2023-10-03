using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Envelope.Budget.Service.Controllers
{
    public enum Test
    {
        Value
    }

    [Route("api/[controller]")]
    [ApiController]
    public class HelloController : Controller
    {
        [HttpGet]
        public ActionResult<string> Hello()
        {
            return Json(new
            {
                Response = "Hello",
                test = new Dictionary<string, string>
                {
                    ["Test"] = "value"
                },
                testEnum = Test.Value
            });
        }
    }
}
