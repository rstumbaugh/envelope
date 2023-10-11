using Envelope.Budget.Service.Auth;
using Envelope.Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.InteropServices;

namespace Envelope.Budget.Service.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserProvider _userProvider;

        public UserController(IUserProvider userProvider)
        {
            _userProvider = userProvider;
        }

        public async Task<User> GetUser()
        {
            var token = HttpContext.User.Claims.First(_ => _.Type == "Token").Value;
            var result = await _userProvider.FromGoogleCredentialAsync(token);
            return result.User;
        }
    }
}
