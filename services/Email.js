const nodemailer = require("nodemailer");
const pug = require("pug");
const html_to_text = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.firstName = user.name.split(" ");
    this.to = user.email;
    this.from = `MTU Code Lab <${process.env.COMPANY_EMAIL}>`;
    this.url = url;
  }
  createNewTransport() {
    if (process.env.NODE_ENV == "production") {
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      subject,
      url: this.url,
      firstName: this.firstName,
    });
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: html_to_text.fromString(html),
    };
    await this.createNewTransport().sendMail(mailOptions);
  }
  async sendWelcome() {
    await this.send("welcome", "Welcome to MTU Code Lab Community");
  }
  async sendVerfication() {
    await this.send("verify", "Plesae verfiy your account");
  }
  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Reset your password here (valid for 10 mins)"
    );
  }
};
