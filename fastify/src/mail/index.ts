// FIXME create mail table to record that it was submit indeed
import { sql } from "drizzle-orm";
import formData from "form-data";
import Mailgun from "mailgun.js";
import { IMailgunClient } from "mailgun.js/Interfaces";
import { v4 as uuidv4 } from "uuid";
import { confirmationMails } from "../database/confirmation-mails";
import { mailLogs } from "../database/mail-logs";
import { recoveryMails } from "../database/recovery-mails";
import { Db } from "../drizzle";
import randomInt from "../utils/random-int";

export default class Mail {
  #mg: IMailgunClient;
  #db: Db;
  #from = {
    username: "info",
    name: "MyNotes Info",
    domain: process.env.MAILGUN_FROM_DOMAIN,
  };

  constructor(db: Db) {
    if (!process.env.MAILGUN_APIKEY) {
      throw new Error("Missing MAILGUN_APIKEY environment variable");
    }

    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: "api",
      key: process.env.MAILGUN_APIKEY,
      url: process.env.MAILGUN_URL,
    });

    this.#mg = mg;
    this.#db = db;
  }

  #buildFrom() {
    return `${this.#from.name} <${this.#from.username}@${this.#from.domain}>`;
  }

  #generateCode() {
    // 6 random numbers from 0 to 9
    const randomNumbers = [...Array(6).keys()].map(() => randomInt(0, 10));
    return Number(randomNumbers.join(""));
  }

  async sendConfirmationEmail(
    userId: number,
    userUsername: string,
    userEmail: string
  ) {
    const [mailLog] = await this.#db
      .insert(mailLogs)
      .values({
        reason: "confirmation_mail",
      })
      .returning({
        id: mailLogs.id,
      });

    const [confirmationMail] = await this.#db
      .insert(confirmationMails)
      .values({
        userId: userId,
        mailId: mailLog.id,
        code: this.#generateCode(),
        uuid: uuidv4(),
      })
      .returning({
        id: confirmationMails.id,
        code: confirmationMails.code,
        uuid: confirmationMails.uuid,
      });

    if (process.env.DISABLE_MAILER === "true") {
      console.log("Mailer is disabled.");
      return;
    }

    const encodedUuid = encodeURI(confirmationMail.uuid);
    const config = {
      from: this.#buildFrom(),
      to: [userEmail],
      subject: "Confirm your email",
      text: `Welcome to MyNotes, ${userUsername}! Your confirmation code is: ${confirmationMail.code}. Visit this page to confirm your email: ${process.env.FRONTEND_URI}/confirm-email?uuid=${confirmationMail.uuid}&code=${confirmationMail.code}`,
      html: `
        <div>
          <h1>Welcome to MyNotes, ${userUsername}!</h1>
          <p>Your confirmation code is: <strong>${confirmationMail.code}</strong>.</p>
          <p><a href="${process.env.FRONTEND_URI}/confirm-email?uuid=${encodedUuid}&code=${confirmationMail.code}">Click here to confirm your email</a></p>
        </div>
      `,
    };

    await this.#mg.messages
      .create(process.env.MAILGUN_DOMAIN || "", config)
      .then(async () => {
        await this.#db.update(mailLogs).set({
          sent: true,
          sentAt: sql`NOW()`,
          lastAttempt: sql`NOW()`,
        });
      })
      .catch(async (err) => {
        console.log("Failed sending email.");
        console.log("Configuration:", config);
        console.log("Error:", err);
        await this.#db.update(mailLogs).set({
          lastAttempt: sql`NOW()`,
        });
      });

    return;
  }

  async resendConfirmationEmail(uuid: string) {
    const confirmationMail = await this.#db.query.confirmationMails.findFirst({
      where(fields, { eq }) {
        return eq(fields.uuid, uuid);
      },
      with: {
        mail: true,
        user: true,
      },
    });

    if (!confirmationMail) {
      throw new Error(
        "Didn't find any confirmation email that corresponds with the uuid " +
          uuid
      );
    }

    if (process.env.DISABLE_MAILER === "true") {
      console.log("Mailer is disabled.");
      return;
    }

    const encodedUuid = encodeURI(confirmationMail.uuid);
    const config = {
      from: this.#buildFrom(),
      to: [confirmationMail.user.email],
      subject: "Confirm your email",
      text: `Welcome to MyNotes, ${confirmationMail.user.username}! Your confirmation code is: ${confirmationMail.code}. Visit this page to confirm your email: ${process.env.FRONTEND_URI}/confirm-email?uuid=${confirmationMail.uuid}&code=${confirmationMail.code}`,
      html: `
        <div>
          <h1>Welcome to MyNotes, ${confirmationMail.user.username}!</h1>
          <p>Your confirmation code is: <strong>${confirmationMail.code}</strong>.</p>
          <p><a href="${process.env.FRONTEND_URI}/confirm-email?uuid=${encodedUuid}&code=${confirmationMail.code}">Click here to confirm your email</a></p>
        </div>
      `,
    };

    await this.#mg.messages
      .create(process.env.MAILGUN_DOMAIN || "", config)
      .then(async () => {
        await this.#db.update(mailLogs).set({
          sent: true,
          sentAt: sql`NOW()`,
          lastAttempt: sql`NOW()`,
        });
      })
      .catch(async (err) => {
        console.log("Failed sending email.");
        console.log("Configuration:", config);
        console.log("Error:", err);
        await this.#db.update(mailLogs).set({
          lastAttempt: sql`NOW()`,
        });
      });
  }

  async sendRecoveryEmail(
    userId: number,
    userUsername: string,
    userEmail: string
  ) {
    const [mailLog] = await this.#db
      .insert(mailLogs)
      .values({
        reason: "recovery_mail",
      })
      .returning({
        id: mailLogs.id,
      });

    const [recoveryMail] = await this.#db
      .insert(recoveryMails)
      .values({
        userId: userId,
        mailId: mailLog.id,
        uuid: uuidv4(),
      })
      .returning({
        id: recoveryMails.id,
        uuid: recoveryMails.uuid,
      });

    if (process.env.DISABLE_MAILER === "true") {
      console.log("Mailer is disabled.");
      return;
    }

    const encodedUuid = encodeURI(recoveryMail.uuid);
    const config = {
      from: this.#buildFrom(),
      to: [userEmail],
      subject: "Reset your password",
      text: `Recover you MyNotes account, ${userUsername}! You have up to 24 hours to visit this page to reset your password: ${process.env.FRONTEND_URI}/reset-password?uuid=${recoveryMail.uuid}`,
      html: `
      <div>
        <h1>Recover you MyNotes account, ${userUsername}!</h1>
        <p><a href="${process.env.FRONTEND_URI}/reset-password?uuid=${encodedUuid}">Click here to reset your password</a></p>
        <p>The link expires in 24 hours.</p>
      </div>
    `,
    };

    await this.#mg.messages
      .create(process.env.MAILGUN_DOMAIN || "", config)
      .then(async () => {
        await this.#db.update(mailLogs).set({
          sent: true,
          sentAt: sql`NOW()`,
          lastAttempt: sql`NOW()`,
        });
      })
      .catch(async (err) => {
        console.log("Failed sending email.");
        console.log("Configuration:", config);
        console.log("Error:", err);
        await this.#db.update(mailLogs).set({
          lastAttempt: sql`NOW()`,
        });
      });

    return;
  }

  async resendRecoveryEmail(uuid: string) {
    const recoveryMail = await this.#db.query.recoveryMails.findFirst({
      where(fields, { eq }) {
        return eq(fields.uuid, uuid);
      },
      with: {
        mail: true,
        user: true,
      },
    });

    if (!recoveryMail) {
      throw new Error(
        "Didn't find any recovery email that corresponds with the uuid " + uuid
      );
    }

    if (process.env.DISABLE_MAILER === "true") {
      console.log("Mailer is disabled.");
      return;
    }

    const encodedUuid = encodeURI(recoveryMail.uuid);
    const config = {
      from: this.#buildFrom(),
      to: [recoveryMail.user.email],
      subject: "Reset your password",
      text: `Recover you MyNotes account, ${recoveryMail.user.username}! You have up to 24 hours to visit this page to reset your password: ${process.env.FRONTEND_URI}/reset-password?uuid=${recoveryMail.uuid}`,
      html: `
      <div>
        <h1>Recover you MyNotes account, ${recoveryMail.user.username}!</h1>
        <p><a href="${process.env.FRONTEND_URI}/reset-password?uuid=${encodedUuid}">Click here to reset your password</a></p>
        <p>The link expires in 24 hours.</p>
      </div>
    `,
    };

    await this.#mg.messages
      .create(process.env.MAILGUN_DOMAIN || "", config)
      .then(async () => {
        await this.#db.update(mailLogs).set({
          sent: true,
          sentAt: sql`NOW()`,
          lastAttempt: sql`NOW()`,
        });
      })
      .catch(async (err) => {
        console.log("Failed sending email.");
        console.log("Configuration:", config);
        console.log("Error:", err);
        await this.#db.update(mailLogs).set({
          lastAttempt: sql`NOW()`,
        });
      });
  }
}
