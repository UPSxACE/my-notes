
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
        app.MapPost("/resend-confirmation", async (ResendConfirmationBody body, Services services, IMailer mailer) =>
        {
            var confirmationMail = await services.ExistingConfirmationMail(x => x.Uid == body.Uid, true, true);

            // 200 in case user wasn't found or it was resent in the last 10 minutes already
            if (confirmationMail == null) return Results.Ok();

            var now = services.TimeNow();
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

        app.MapGet("/confirmation-state", async (string uid, Services services) =>
        {
            var mail = await services.ExistingConfirmationMail(x => x.Uid == uid, user: true);

            if (mail == null) return Results.NotFound();

            return Results.Ok(new { state = mail.User.Verified ?? false ? "VERIFIED" : "UNVERIFIED" });
        });

        app.MapPost("/confirm-email", async (ConfirmEmailBody body, Services services) =>
        {
            var mail = await services.ExistingConfirmationMail(x => x.Uid == body.Uid && x.Code == body.Code, user: true);

            if (mail == null) return Results.BadRequest();
            if (mail.User.Verified ?? false == false)
            {
                mail.User.Verified = true;
                await services.SaveChanges();
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