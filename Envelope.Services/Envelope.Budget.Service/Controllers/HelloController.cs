using Google.Apis.Auth;
using Microsoft.AspNetCore.Authorization;
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

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<string>> GetName([FromBody] string cred)
        {
            var user = HttpContext.User;
            return Json(HttpContext.User.Identity.Name);
        }
    }
}
