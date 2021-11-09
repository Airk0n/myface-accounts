using System;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MyFace.Models.Database;
using MyFace.Repositories;

namespace MyFace.Authentication
{
    public class BasicAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        private readonly IUsersRepo _iUserRepo;
        
        public BasicAuthenticationHandler(
            IOptionsMonitor<AuthenticationSchemeOptions> options, 
            ILoggerFactory logger, 
            UrlEncoder encoder, 
            ISystemClock clock,
            IUsersRepo userRepo) : base(options, logger, encoder, clock)
        {
            _iUserRepo = userRepo;
        }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        { 
            try
            {
                // Get details from user.
                var authHeader = AuthenticationHeaderValue.Parse(Request.Headers["Authorization"]);
                var credentialBytes = Convert.FromBase64String(authHeader.Parameter);
                var credentials = Encoding.UTF8.GetString(credentialBytes).Split(new[] { ':' }, 2);
                var username = credentials[0];
                var password = credentials[1];

                // Get user object from user details
                User userToCheck = _iUserRepo.GetUserByUsername(username);
                if(userToCheck == null) return AuthenticateResult.Fail("User not found.");
                byte[] salt = userToCheck.Salt;
                
                // Hash user details
                string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                    password: password,
                    salt: salt,
                    prf: KeyDerivationPrf.HMACSHA256,
                    iterationCount: 100000,
                    numBytesRequested: 256 / 8));
                
                // Create ticket
                var claims = new[]
                {
                    new Claim(ClaimTypes.Name, userToCheck.Username),
                };
 
                var identity = new ClaimsIdentity(claims, Scheme.Name);
                var principal = new ClaimsPrincipal(identity);
 
                var ticket = new AuthenticationTicket(principal, Scheme.Name);
                
                // Compared Hashed values.
                if (hashed == userToCheck.HashedPassword) return AuthenticateResult.Success(ticket);
            }
            catch
            {
                return AuthenticateResult.Fail("Error Occured.Authorization failed.");
            }

            return AuthenticateResult.Fail("Failed after TRY CATCH");
            //if (user == null)
            //    return AuthenticateResult.Fail("Invalid Credentials");
        }
    }
}