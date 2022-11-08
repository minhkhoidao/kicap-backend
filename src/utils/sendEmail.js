/** @format */

import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(
  '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'
);

export const sendEmail = (options) => {
  // const transporter = nodemailer.createTransport({
  //   service: 'SendGrid',
  //   auth: {
  //     user: process.env.EMAIL_USERNAME,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  //   port: 587,
  // });
  // const mailOptions = {
  //   from: process.env.EMAIL_FROM,
  //   to: options.to,
  //   subject: options.subject,
  //   html: options.text,
  // };

  sgMail.send({
    To: options.to, // receiver email address
    from: 'gogotuyer22@gmail.com',
    subject: options.subject,
    text: options.text,
  });
  // transporter.sendMail(mailOptions, function (err, info) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log(info);
  //   }
  // });
};
