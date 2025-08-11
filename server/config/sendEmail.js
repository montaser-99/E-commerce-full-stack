import { Resend } from 'resend';
import dotenv from 'dotenv'
dotenv.config()



if(!process.env.RESEND_API){
    console.log("Provide RESEND_API in side the .env file")
}

const resend = new Resend(process.env.RESEND_API_SECRET);

   export const sendEmail=async ({sendTo,subject,html}) =>{
    try
  {const { data, error } = await resend.emails.send({
    from: 'Montaser E-Commerce <onboarding@resend.dev>',
    to: sendTo,
    subject:subject,
    html:html ,
  });

  if (error) {
    return console.error({ error });
  }

  // console.log({ data });
  }
  catch (error) {
        console.log(error)
    }
}