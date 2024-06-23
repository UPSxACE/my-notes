
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
    private static void RegisterConfirmationMailRoutes(ref RouteGroupBuilder app)
    {
        app.MapPost("/resend-confirmation", async (ResendConfirmationBody body, Db db, IMailer mailer) =>
        {
            var confirmationMail = await db.ConfirmationMails.Include(x => x.Mail)
                                                       .Include(x => x.User)
                                                       .Where(x => x.Uid == body.Uid)
                                                       .FirstOrDefaultAsync();

            // 200 in case user wasn't found or it was resent in the last 10 minutes already
            if (confirmationMail == null) return Results.Ok();

            var now = db.Database.SqlQuery<DateTime>($"SELECT now()").AsEnumerable().First();
            var lastAttempt = confirmationMail.Mail.LastAttempt;
            if (lastAttempt != null)
            {
                DateTime lastAttemptChecked = (DateTime)lastAttempt;
                DateTime lastAttemptPlus10 = lastAttemptChecked.AddMinutes(10);
                var canResend = now > lastAttemptPlus10;
                if (!canResend)
                {
                    // resent in the last 10 minutes already
                    return Results.Ok();
                }
            }

            // if the user was already verified return 400
            if (confirmationMail.User.Verified == true) return Results.BadRequest();

            // in other cases resend email
            await mailer.ResendConfirmationEmail(confirmationMail.Uid);
            return Results.Ok();
        }).AddEndpointFilter<BodyValidator<ResendConfirmationValidator, ResendConfirmationBody>>();

        app.MapGet("/confirmation-state", async (string uid, Db db) =>
        {
            var mail = await db.ConfirmationMails.Where(x => x.Uid == uid).Include(x => x.User).FirstOrDefaultAsync();

            if (mail == null) return Results.NotFound();

            return Results.Ok(new { state = mail.User.Verified ?? false ? "VERIFIED" : "UNVERIFIED" });
        });

        app.MapPost("/confirm-email", async (ConfirmEmailBody body, Db db) =>
        {
            var mail = await db.ConfirmationMails.Where(x => x.Uid == body.Uid && x.Code == body.Code)
                                                 .Include(x => x.User)
                                                 .FirstOrDefaultAsync();

            if (mail == null) return Results.BadRequest();
            if (mail.User.Verified ?? false == false)
            {
                mail.User.Verified = true;
                await db.SaveChangesAsync();
            }

            return Results.Ok();
        }).AddEndpointFilter<BodyValidator<ConfirmEmailValidator, ConfirmEmailBody>>();
    }
}



public record ResendConfirmationBody(string Uid);
public partial class ResendConfirmationValidator : AbstractValidator<ResendConfirmationBody>
{
    public ResendConfirmationValidator()
    {
        RuleFor(x => x.Uid).NotEmpty().WithMessage("This field is required");
    }
}

public record ConfirmEmailBody(string Uid, int Code);
public partial class ConfirmEmailValidator : AbstractValidator<ConfirmEmailBody>
{
    public ConfirmEmailValidator()
    {
        RuleFor(x => x.Uid).NotEmpty().WithMessage("This field is required");
        RuleFor(x => x.Code).NotEmpty().WithMessage("This field is required");
    }
}