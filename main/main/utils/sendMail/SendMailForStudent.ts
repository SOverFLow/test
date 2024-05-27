"use server";
import { Resend } from "resend";

interface SendEmailProps {
  name: string;
  email: string;
  confirmationLink: string;
}

async function sendMailForStudent(data: SendEmailProps) {
  console.log("sending mail: ", data); 
  const resend = new Resend(process.env.NEXT_PUBLIC_RESEND);

  const { data: res, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: data.email,
    subject: "TeamShift - Facture est prête!",
    html: `<div>\
    <h6>Hi ${data.name}!</h6>\
    <p>Formation Questions Form.</p>\
    <br/>\
    <a href=${data.confirmationLink}>\
      Cliquez ici pour confimer votre facture.\
    </a>\
  </div>`,
  });
  if (error) {
    return { data: null, error: "Something went wrong!" };
  }
  return { data: "Email sent successfully", error: null };
}

export default sendMailForStudent;