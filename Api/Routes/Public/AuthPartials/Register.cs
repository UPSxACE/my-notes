
using System.Text.RegularExpressions;
using Database;
using FluentValidation;
using Mail;
using Microsoft.EntityFrameworkCore;
using Passwords;
using Utils;

namespace Routes;
public static partial class AuthRoutesExtension
{
    private static void RegisterRegisterRoutes(ref RouteGroupBuilder app)
    {
        app.MapPost("/register", async (RegisterBody body, Db db, IMailer mailer) =>
         {
             // Check existing username/email
             var existingUser = await db.Users.Where(
                 x => x.Email.Equals(body.Email) || x.Username.Equals(body.Username)
             ).FirstOrDefaultAsync();
             if (existingUser != null)
             {
                 var conflicts = new List<string> { };
                 var sameEmail = existingUser.Email.Equals(body.Email);
                 var sameUsername = existingUser.Username.Equals(body.Username);
                 if (sameEmail) conflicts.Add("email");
                 if (sameUsername) conflicts.Add("username");
                 return Results.Conflict(conflicts);
             }

             // Create new user
             var hashedPassword = Password.Hash(body.Password);
             var user = new UserModel
             {
                 Username = body.Username,
                 Email = body.Email,
                 Password = hashedPassword,
                 FullName = body.FullName
             };

             await db.Users.AddAsync(user);
             await db.SaveChangesAsync();

             await mailer.SendConfirmationEmail(user.ID, user.Username, user.Email);

             return Results.Created();
         }).AddEndpointFilter<BodyValidator<RegisterValidator, RegisterBody>>();
    }
}


public record RegisterBody(string Username, string Email, string Password, string FullName);
public partial class RegisterValidator : AbstractValidator<RegisterBody>
{
    public RegisterValidator()
    {
        RuleFor(x => x.Username)
            .NotEmpty().WithMessage("This field is required")
            .Must(ValidateUsernameRegex).WithMessage("Usernames can only include letters, numbers, periods, hyphens, and underscores, with the exception that periods, hyphens, and underscores cannot be placed at the start or end.")
            .MinimumLength(3).WithMessage("Please pick a bigger username")
            .MaximumLength(24).WithMessage("Your username is too big");
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("This field is required")
            .EmailAddress().WithMessage("Invalid email format");
        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("This field is required")
            .Must(ValidatePasswordRegex).WithMessage("Your password contains illegal characters")
            .MinimumLength(8).WithMessage("Your password is too small")
            .MaximumLength(64).WithMessage("Your password is too big")
            .Must(ValidatePasswordCasing).WithMessage("Your password needs at least 1 lower case and 1 upper case character")
            .Must(ValidatePasswordNumbers).WithMessage("Your password needs at least 1 number");
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("This field is required");
    }

    private bool ValidateUsernameRegex(string? username)
    {
        if (username == null) return true;
        if (!UsernameRegex().IsMatch(username)) return false;
        return true;
    }
    private bool ValidatePasswordRegex(string? password)
    {
        if (password == null) return true;
        if (!PasswordRegex().IsMatch(password)) return false;
        return true;
    }
    private bool ValidatePasswordCasing(string? password)
    {
        if (password == null) return true;
        if (password.Equals(password.ToUpper()) || password.Equals(password.ToLower())) return false;
        return true;
    }
    private bool ValidatePasswordNumbers(string? password)
    {
        if (password == null) return true;
        if (!PasswordRegex().IsMatch("[0-9]+")) return false;
        return true;
    }

    [GeneratedRegex(Regexes.REGEX_USERNAME)]
    private static partial Regex UsernameRegex();
    [GeneratedRegex(Regexes.REGEX_PASSWORD)]
    private static partial Regex PasswordRegex();
}
