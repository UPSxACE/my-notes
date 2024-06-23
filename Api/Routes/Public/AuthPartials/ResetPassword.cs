
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
    private static void RegisterResetPasswordRoutes(ref RouteGroupBuilder app)
    {

        app.MapPost("/forgot-password", async (ForgotPasswordBody body, Db db, IMailer mailer) =>
        {
            var user = await db.Users.Where(x => x.Email == body.Email).FirstOrDefaultAsync();
            if (user == null)
            {
                // if user doesn't exist, return 200
                return Results.Ok();
            }

            var recoveryMail = await db.RecoveryMails.Where(x => x.UserID == user.ID)
                                                     .Include(x => x.Mail)
                                                     .OrderByDescending(x => x.CreatedAt)
                                                     .FirstOrDefaultAsync();

            // 1 recovery email per 24h, unless it was already used

            if (recoveryMail == null || recoveryMail.UsedAt != null)
            {
                // doesn't exist = create new one and send
                // already used = create new one and send
                await mailer.SendRecoveryEmail(user.ID, user.Username, user.Email);
                return Results.Ok();
            }

            var now = db.Database.SqlQuery<DateTime>($"SELECT now()").AsEnumerable().First();
            var lastAttempt = recoveryMail.Mail.LastAttempt;
            if (lastAttempt == null)
            {
                // if last attempt never happened, try resending now again
                await mailer.ResendRecoveryEmail(recoveryMail.Uid);
                return Results.Ok();
            }
            var lastAttemptChecked = (DateTime)lastAttempt;
            var expired = now > lastAttemptChecked.AddDays(1);
            if (expired)
            {
                // if expired create a new one and send
                await mailer.SendRecoveryEmail(user.ID, user.Username, user.Email);
                return Results.Ok();
            }
            var canResend = lastAttemptChecked < now.AddMinutes(-30);
            if (canResend)
            {
                // it's been 30 minutes since last time, so resend
                await mailer.ResendRecoveryEmail(recoveryMail.Uid);
                return Results.Ok();
            }

            // its not been 30 minutes since it was sent/resent
            return Results.Ok();
        }).AddEndpointFilter<BodyValidator<ForgotPasswordValidator, ForgotPasswordBody>>();

        app.MapGet("/recovery-state", async (string uid, Db db) =>
        {
            var mail = await db.RecoveryMails.Where(x => x.Uid == uid && x.CreatedAt == null).Include(x => x.User).FirstOrDefaultAsync();

            if (mail == null) return Results.NotFound();

            var now = db.Database.SqlQuery<DateTime>($"SELECT now()").AsEnumerable().First();
            var createdAt = mail.CreatedAt ?? DateTime.MinValue;
            var expired = now > createdAt.AddDays(1);
            if (expired) return Results.NotFound();

            return Results.Ok(new { state = "READY" });
        });

        app.MapPost("/reset-password", async (ResetPasswordBody body, Db db) =>
        {
            var mail = await db.RecoveryMails.Where(x => x.Uid == body.Uid && x.CreatedAt == null).Include(x => x.User).FirstOrDefaultAsync();

            // if there is no unused recovery mail found, return 404 (not found, expired or invalid)
            if (mail == null) return Results.NotFound();

            var now = db.Database.SqlQuery<DateTime>($"SELECT now()").AsEnumerable().First();
            var createdAt = mail.CreatedAt ?? DateTime.MinValue;
            var expired = now > createdAt.AddDays(1);
            // if the code is already expired, return 404 (not found, expired or invalid)
            if (expired) return Results.NotFound();

            var hashedPassword = Password.Hash(body.NewPassword);
            mail.User.Password = hashedPassword;
            mail.User.UpdatedAt = now;
            mail.UsedAt = now;

            await db.SaveChangesAsync();

            return Results.Ok();
        }).AddEndpointFilter<BodyValidator<ResetPasswordValidator, ResetPasswordBody>>(); ;

    }
}



public record ForgotPasswordBody(string Email);
public partial class ForgotPasswordValidator : AbstractValidator<ForgotPasswordBody>
{
    public ForgotPasswordValidator()
    {
        RuleFor(x => x.Email).NotEmpty().WithMessage("This field is required")
                             .EmailAddress().WithMessage("Invalid email format");
    }
}

public record ResetPasswordBody(string Uid, string NewPassword);
public partial class ResetPasswordValidator : AbstractValidator<ResetPasswordBody>
{
    public ResetPasswordValidator()
    {
        RuleFor(x => x.NewPassword)
            .NotEmpty().WithMessage("This field is required")
            .Must(ValidatePasswordRegex).WithMessage("Your password contains illegal characters")
            .MinimumLength(8).WithMessage("Your password is too small")
            .MaximumLength(64).WithMessage("Your password is too big")
            .Must(ValidatePasswordCasing).WithMessage("Your password needs at least 1 lower case and 1 upper case character")
            .Must(ValidatePasswordNumbers).WithMessage("Your password needs at least 1 number");
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

    [GeneratedRegex(Regexes.REGEX_PASSWORD)]
    private static partial Regex PasswordRegex();
}
