using Envelope.Core.Models;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Authentication;

namespace Envelope.Budget.Service.Auth
{
    public class UserAuthResult 
    {
        public bool Success { get; set; }
        public string Error { get; set; }
        public User User { get; set; }
    }

    public interface IUserProvider
    {
        public Task<UserAuthResult> FromGoogleCredentialAsync(string token);
    }

    public class UserProvider : IUserProvider
    {
        public async Task<UserAuthResult> FromGoogleCredentialAsync(string token)
        {
            if (string.IsNullOrWhiteSpace(token))
            {
                return new UserAuthResult
                {
                    Success = false,
                    Error = "Missing token"
                };
            }

            GoogleJsonWebSignature.Payload result;
            try
            {
                result = await GoogleJsonWebSignature.ValidateAsync(token);
            }
            catch (Exception)
            {
                return new UserAuthResult
                {
                    Success = false,
                    Error = "Nonexistent Google user"
                };
            }

            return new UserAuthResult
            {
                Success = true,
                User = new User
                {
                    Name = result.Name,
                    Email = result.Email,
                }
            };
        }
    }

    public class NullUserProvider : IUserProvider
    {
        public Task<UserAuthResult> FromGoogleCredentialAsync(string token)
        {
            return Task.FromResult(new UserAuthResult
            {
                Success = true,
                User = new User
                {
                    Id = 1,
                    Name = "Ryan S",
                    Email = "rstumbaugh1@gmail.com"
                }
            });
        }
    }

}
