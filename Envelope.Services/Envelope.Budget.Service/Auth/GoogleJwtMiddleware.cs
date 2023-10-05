using Google.Apis.Auth;

namespace Envelope.Budget.Service.Auth
{
    public class GoogleJwtMiddleware
    {
        private readonly RequestDelegate _next;

        public GoogleJwtMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").LastOrDefault();

            if (token != null)
            {
                await AttachUserToContext(context, token);
            }

            await _next(context);
        }

        private async Task AttachUserToContext(HttpContext context, string token)
        {
            var result = await GoogleJsonWebSignature.ValidateAsync(token);
        }
    }
}
