using Google.Apis.Auth;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.WebUtilities;
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
        private readonly ILogger<GoogleAuthenticationHandler> _logger;
        private readonly IUserProvider _userProvider;

        public GoogleAuthenticationHandler(
            IOptionsMonitor<GoogleAuthenticationHandlerOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            ISystemClock clock,
            IUserProvider userProvider) : base(options, logger, encoder, clock)
        {
            _logger = logger.CreateLogger<GoogleAuthenticationHandler>();
            _userProvider = userProvider;
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

            var result = await _userProvider.FromGoogleCredentialAsync(token);
            if (!result.Success)
            {
                return AuthenticateResult.Fail(result.Error);
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, result.User.Name),
                new Claim("Token", token)
            };

            var identity = new ClaimsIdentity(claims, Scheme.Name);

            var principal = new ClaimsPrincipal(identity);

            return AuthenticateResult.Success(new AuthenticationTicket(principal, Scheme.Name));
        }
    }
}
