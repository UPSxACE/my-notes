using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Jwt;
public class Token(IConfiguration config)
{
    readonly string JWT_SECRET = config["JWT_SECRET"] ?? throw new Exception("JWT_SECRET Config Missing");
    readonly string JWT_COOKIE_DOMAIN = config["JWT_COOKIE_DOMAIN"] ?? throw new Exception("JWT_COOKIE_DOMAIN Config Missing");

    public string Create(string id, string[] roles, string isDemo)
    {
        // FIXME: In the future, tokens with "isDemo" set to "true" will have a shorter lifespan
        List<Claim> identityClaims = [];
        identityClaims.Add(new Claim("userId", id));
        identityClaims.Add(new Claim("isDemo", isDemo));
        foreach (var role in roles)
        {
            identityClaims.Add(new Claim(ClaimTypes.Role, role));
        }

        var key = Encoding.ASCII.GetBytes(JWT_SECRET);
        var tokenConfig = new SecurityTokenDescriptor
        {
            Subject = new System.Security.Claims.ClaimsIdentity(identityClaims),
            Expires = DateTime.UtcNow.AddDays(3),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature) // NOTE: if key is too small can raise error?
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenConfig);
        var tokenString = tokenHandler.WriteToken(token);

        return tokenString;
    }

    public CookieOptions GetJwtCookieOptions(bool isProduction)
    {
        return new CookieOptions
        {
            Path = "/",
            Domain = JWT_COOKIE_DOMAIN,
            Expires = DateTime.UtcNow.AddDays(3),
            HttpOnly = isProduction,
            Secure = isProduction,
            SameSite = SameSiteMode.Strict
        };
    }
}