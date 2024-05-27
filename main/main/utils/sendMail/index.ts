"use server";
import nodemailer from "nodemailer";

interface SendEmailProps {
  name: string;
  email: string;
  invoiceLink: string;
  confirmationLink: string;
}

async function sendInvoiceMail(data: SendEmailProps) {
  console.log("sending invoice mail: ", data);
  try {
    const transporter = nodemailer.createTransport({
      // @ts-ignore
      host: process.env.NEXT_PUBLIC_SMTP_HOST || "smtp.hostinger.com",
      port: process.env.NEXT_PUBLIC_SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.NEXT_PUBLIC_SMTP_EMAIL,
        pass: process.env.NEXT_PUBLIC_SMTP_PASS,
      },
    });

    const res = await transporter.sendMail({
      from: `"teamshifs.io" <${process.env.NEXT_PUBLIC_SMTP_EMAIL}>`,
      to: data.email,
      subject: "Votre facture est prête.",
      html: `<div>\
      <h6>Hi ${data.name}!</h6>\
      <p>Votre facture est prête.</p>\
      <a href=${data.invoiceLink}>\
      Cliquez ici pour voir votre facture.\
      </a>\
      <br/>\
      <a href=${data.confirmationLink}>\
      Cliquez ici pour confimer votre facture.\
      </a>\
      </div>`,
    });
    console.log("nodemailer res: ", res);
  } catch (error) {
    console.log("transporter error: ", error);
    return { data: null, error: "Something went wrong!" };
  }
  return { data: "Email sent successfully", error: null };
}

export default sendInvoiceMail;
