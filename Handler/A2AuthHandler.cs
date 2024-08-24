using A2_jji134.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore;
// using Microsoft.AspNetCore.Authorization;
using System.Text.Encodings.Web;

namespace A2_jji134.Handler
{
    public class A2AuthHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        private readonly IA2Repo _repo;
        public A2AuthHandler(
            IA2Repo repo,
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            ISystemClock clock)
            : base(options, logger, encoder, clock)
        {
            _repo = repo;
        }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            if (!Request.Headers.ContainsKey("Authorization"))
            {
                Response.Headers.Add("WWW-Authenticate", "Basic");
                return AuthenticateResult.Fail("Authorization header not found.");
            }
            else
            {
                var authHeader = AuthenticationHeaderValue.Parse(Request.Headers["Authorization"]);
                var credentialBytes = Convert.FromBase64String(authHeader.Parameter);
                var credentials = Encoding.UTF8.GetString(credentialBytes).Split(":");
                var username = credentials[0];
                var password = credentials[1];
                if (_repo.ValidUserLogin(username, password))
                {
                    var claims = new[] { new Claim("user", username) };

                    ClaimsIdentity identity = new ClaimsIdentity(claims, "Basic");
                    ClaimsPrincipal principal = new ClaimsPrincipal(identity);

                    AuthenticationTicket ticket = new AuthenticationTicket(principal, Scheme.Name);
                    
                    return AuthenticateResult.Success(ticket);
                } else if(_repo.ValidOrganizerLogin(username, password))
                {
                    var claims = new[] { new Claim("organizer", username) };

                    ClaimsIdentity identity = new ClaimsIdentity(claims, "Basic");
                    ClaimsPrincipal principal = new ClaimsPrincipal(identity);

                    AuthenticationTicket ticket = new AuthenticationTicket(principal, Scheme.Name);
                    
                    return AuthenticateResult.Success(ticket);
                }
                else 
                {
                    Response.Headers.Add("WWW-Authenticate", "Basic");
                    return AuthenticateResult.Fail("username and password do not match");
                }
            }
        }
    }
        
}