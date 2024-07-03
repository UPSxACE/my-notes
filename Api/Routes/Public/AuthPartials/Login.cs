
using Database;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Passwords;
using Utils;

namespace Routes;
public static partial class AuthRoutesExtension
{
    private static void RegisterLoginRoutes(ref RouteGroupBuilder app)
    {
        app.MapPost("/login", async (LoginBody body, Services services, HttpContext http, IConfiguration config, IHostEnvironment env) =>
       {
           var user = await services.ExistingUser(
               x => x.Email.Equals(body.Identifier) || x.Username.Equals(body.Identifier
           ));

           if (user == null) return Results.NotFound();

           var validPassword = Password.Verify(body.Password, user.Password ?? "");
           if (!validPassword)
           {
               return Results.BadRequest();
           }

           var tokenBuilder = new Jwt.Token(config);
           var token = tokenBuilder.Create(user.ID.ToString(), ["user"], "false");

           var cookieName = config["JWT_COOKIE_NAME"] ?? "";
           var cookieOptions = tokenBuilder.GetJwtCookieOptions(env.IsProduction());
           if (cookieName != "") http.Response.Cookies.Append(cookieName, token, cookieOptions);

           return Results.Ok(new { access_token = token });
       }).AddEndpointFilter<BodyValidator<LoginValidator, LoginBody>>();
    }
}


public record LoginBody(string Identifier, string Password);
public class LoginValidator : AbstractValidator<LoginBody>
{
    public LoginValidator()
    {
        RuleFor(x => x.Identifier).NotEmpty().WithMessage("This field is required");
        RuleFor(x => x.Password).NotEmpty().WithMessage("This field is required");
    }
}