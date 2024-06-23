using System.Text.Encodings.Web;
using Database;
using MailKit.Net.Smtp;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using System.Web;

namespace Mail;

public interface IMailer
{
    Task SendConfirmationEmail(int userId, string username, string email);
    Task ResendConfirmationEmail(string uid);
    Task SendRecoveryEmail(int userId, string username, string email);
    Task ResendRecoveryEmail(string uid);
}

public class Mailer(IConfiguration config, Db db) : IMailer
{
    readonly Db db = db;
    readonly bool MailerEnabled = (config["MAILER_ENABLED"] ?? "false") == "true";
    readonly string SMTPHost = config["SMTP_HOST"] ?? throw new Exception("SMTP_HOST Config Missing");
    readonly string SMTPPort = config["SMTP_PORT"] ?? throw new Exception("SMTP_PORT Config Missing");
    readonly string SMTPUser = config["SMTP_USER"] ?? throw new Exception("SMTP_USER Config Missing");
    readonly string SMTPPass = config["SMTP_PASS"] ?? throw new Exception("SMTP_PASS Config Missing");
    readonly string FromName = config["SMTP_FROM_NAME"] ?? throw new Exception("SMTP_FROM_NAME Config Missing");
    readonly string FromEmail = config["SMTP_FROM_EMAIL"] ?? throw new Exception("SMTP_FROM_EMAIL Config Missing");
    readonly string FrontendURI = config["FRONTEND_URI"] ?? throw new Exception("FRONTEND_URI Config Missing");

    private static int GenerateCode()
    {
        string code = "";
        Random rnd = new();
        for (int x = 0; x < 6; x++)
        {
            int num = rnd.Next(0, 10);
            code += num.ToString();
        }

        int codeConverted = int.Parse(code);
        return codeConverted;
    }

    // Returns a MimeMessage object, with the from, to, and subject headers filled
    private MimeMessage GetMimeMessage(string toUsername, string toEmail, string subject)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(FromName, FromEmail));
        message.To.Add(new MailboxAddress(toUsername, toEmail));
        message.Subject = subject;

        return message;
    }

    private MimeEntity GetConfirmationEmailBody(string username, int code, string uid)
    {
        var encodedUid = HttpUtility.UrlEncode(uid);
        var q = "\"";
        var text = $"Welcome to MyNotes, {username}! Your confirmation code is: {code}. Visit this page to confirm your email: {FrontendURI}/confirm-email?uid={encodedUid}&code={code}";
        var html = @$"
            <div>
                <h1>Welcome to MyNotes, {username}!</h1>
                <p>Your confirmation code is: <strong>{code}</strong>.</p>
                <p><a href={q}{FrontendURI}/confirm-email?uid={encodedUid}&code={code}{q}>Click here to confirm your email</a></p>
            </div>
        ";

        var bodyBuilder = new BodyBuilder
        {
            TextBody = text,
            HtmlBody = html
        };

        return bodyBuilder.ToMessageBody();
    }

    private MimeEntity GetRecoveryEmailBody(string username, string uid)
    {
        var encodedUid = HttpUtility.UrlEncode(uid);
        var q = "\"";
        var text = $"Recover you MyNotes account, {username}! You have up to 24 hours to visit this page to reset your password: {FrontendURI}/reset-password?uuid={encodedUid}";
        var html = @$"
            <div>
                <h1>Recover you MyNotes account, {username}!</h1>
                <p><a href={q}${FrontendURI}/reset-password?uuid={encodedUid}{q}>Click here to reset your password</a></p>
                <p>The link expires in 24 hours.</p>
            </div>
        ";

        var bodyBuilder = new BodyBuilder
        {
            TextBody = text,
            HtmlBody = html
        };

        return bodyBuilder.ToMessageBody();
    }

    public async Task SendConfirmationEmail(int userId, string username, string email)
    {
        var user = await db.Users.Where(x => x.ID == userId).FirstOrDefaultAsync() ?? throw new Exception("User id does not exist");

        var code = GenerateCode();
        var uid = Guid.NewGuid().ToString();
        var mail = new MailModel { Reason = "confirmation_mail" };
        await db.Mails.AddAsync(mail);
        await db.SaveChangesAsync();

        var confirmationMail = new ConfirmationMailModel { Mail = mail, Uid = uid, Code = code, User = user };
        await db.ConfirmationMails.AddAsync(confirmationMail);
        await db.SaveChangesAsync();

        if (!MailerEnabled)
        {
            Console.WriteLine("Mailer is disabled");
            return;
        }

        var message = GetMimeMessage(username, email, "Confirm your email");
        message.Body = GetConfirmationEmailBody(username, code, uid);

        using var client = new SmtpClient();
        var port = int.Parse(SMTPPort);
        client.Connect(SMTPHost, port, false);
        client.Authenticate(SMTPUser, SMTPPass);

        try
        {
            var result = await client.SendAsync(message);
            var now = db.Database.SqlQuery<DateTime>($"SELECT now()").AsEnumerable().First();
            mail.Sent = true;
            mail.SentAt = now;
            mail.LastAttempt = now;
            await db.SaveChangesAsync();
        }
        catch (Exception e)
        {
            Console.WriteLine("Failed sending email.");
            Console.WriteLine(e);
        }

        client.Disconnect(true);
    }

    public async Task ResendConfirmationEmail(string uid)
    {
        var confirmationMail = db.ConfirmationMails.Include(x => x.Mail)
                                                               .Include(x => x.User)
                                                               .Where(x => x.Uid == uid)
                                                               .FirstOrDefault();

        if (confirmationMail == null) throw new Exception($"Didn't find any confirmation email that corresponds with the uid {uid}");

        if (!MailerEnabled)
        {
            Console.WriteLine("Mailer is disabled");
            return;
        }

        var message = GetMimeMessage(confirmationMail.User.Username, confirmationMail.User.Email, "Confirm your email");
        message.Body = GetConfirmationEmailBody(confirmationMail.User.Username, confirmationMail.Code, confirmationMail.Uid);

        using var client = new SmtpClient();
        var port = int.Parse(SMTPPort);
        client.Connect(SMTPHost, port, false);
        client.Authenticate(SMTPUser, SMTPPass);

        try
        {
            var result = await client.SendAsync(message);
            var now = db.Database.SqlQuery<DateTime>($"SELECT now()").AsEnumerable().First();
            confirmationMail.Mail.Sent = true;
            confirmationMail.Mail.LastAttempt = now;
            await db.SaveChangesAsync();
        }
        catch (Exception e)
        {
            Console.WriteLine("Failed sending email.");
            Console.WriteLine(e);
        }

        client.Disconnect(true);
    }

    public async Task SendRecoveryEmail(int userId, string username, string email)
    {
        var user = await db.Users.Where(x => x.ID == userId).FirstOrDefaultAsync() ?? throw new Exception("User id does not exist");

        var uid = Guid.NewGuid().ToString();
        var mail = new MailModel { Reason = "recovery_mail" };
        await db.Mails.AddAsync(mail);
        await db.SaveChangesAsync();

        var recoveryMail = new RecoveryMailModel { Mail = mail, Uid = uid, User = user };
        await db.RecoveryMails.AddAsync(recoveryMail);
        await db.SaveChangesAsync();

        if (!MailerEnabled)
        {
            Console.WriteLine("Mailer is disabled");
            return;
        }

        var message = GetMimeMessage(username, email, "Reset your password");
        message.Body = GetRecoveryEmailBody(username, uid);

        using var client = new SmtpClient();
        var port = int.Parse(SMTPPort);
        client.Connect(SMTPHost, port, false);
        client.Authenticate(SMTPUser, SMTPPass);

        try
        {
            var result = await client.SendAsync(message);
            var now = db.Database.SqlQuery<DateTime>($"SELECT now()").AsEnumerable().First();
            mail.Sent = true;
            mail.SentAt = now;
            mail.LastAttempt = now;
            await db.SaveChangesAsync();
        }
        catch (Exception e)
        {
            Console.WriteLine("Failed sending email.");
            Console.WriteLine(e);
        }

        client.Disconnect(true);
    }

    public async Task ResendRecoveryEmail(string uid)
    {
        var recoveryMail = db.RecoveryMails.Include(x => x.Mail)
                                                               .Include(x => x.User)
                                                               .Where(x => x.Uid == uid)
                                                               .FirstOrDefault();

        if (recoveryMail == null) throw new Exception($"Didn't find any recovery email that corresponds with the uid {uid}");

        if (!MailerEnabled)
        {
            Console.WriteLine("Mailer is disabled");
            return;
        }

        var message = GetMimeMessage(recoveryMail.User.Username, recoveryMail.User.Email, "Reset your password");
        message.Body = GetRecoveryEmailBody(recoveryMail.User.Username, recoveryMail.Uid);

        using var client = new SmtpClient();
        var port = int.Parse(SMTPPort);
        client.Connect(SMTPHost, port, false);
        client.Authenticate(SMTPUser, SMTPPass);

        try
        {
            var result = await client.SendAsync(message);
            var now = db.Database.SqlQuery<DateTime>($"SELECT now()").AsEnumerable().First();
            recoveryMail.Mail.Sent = true;
            recoveryMail.Mail.LastAttempt = now;
            await db.SaveChangesAsync();
        }
        catch (Exception e)
        {
            Console.WriteLine("Failed sending email.");
            Console.WriteLine(e);
        }

        client.Disconnect(true);
    }
}