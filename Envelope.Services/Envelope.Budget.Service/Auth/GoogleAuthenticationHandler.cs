using Google.Apis.Auth;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Text.Encodings.Web;

namespace Envelope.Budget.Service.Auth
{
    public class GoogleAuthenticationHandlerOptions : AuthenticationSchemeOptions
    {
        public const string Scheme = "GoogleAuthenticationHandler";
    }

    public class GoogleAuthenticationHandler : AuthenticationHandler<GoogleAuthenticationHandlerOptions>
    {
        public GoogleAuthenticationHandler(
            IOptionsMonitor<GoogleAuthenticationHandlerOptions> options, 
            ILoggerFactory logger, 
            UrlEncoder encoder, 
            ISystemClock clock) : base(options, logger, encoder, clock)
        {
        }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            if (!Request.Headers.TryGetValue("Authorization", out var headers) || !headers.Any())
            {
                return AuthenticateResult.Fail("Missing Authorization header");
            }

            var token = headers.FirstOrDefault()?.Split(" ").LastOrDefault();
            if (token == null)
            {
                return AuthenticateResult.Fail("Empty bearer header");
            }

            GoogleJsonWebSignature.Payload result;
            try
            {
                result = await GoogleJsonWebSignature.ValidateAsync(token);
            } 
            catch (Exception)
            {
                return AuthenticateResult.Fail("Nonexistent Google user");
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, result.Name)
            };

            var identity = new ClaimsIdentity(claims, Scheme.Name);

            var principal = new ClaimsPrincipal(identity);

            return AuthenticateResult.Success(new AuthenticationTicket(principal, Scheme.Name));
        }
    }
}
