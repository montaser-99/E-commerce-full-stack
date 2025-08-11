export const verifyemailtemplate = ({ name, url }) => {
    return `
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px;">
         <h2>Welcome ${name} to Montaser E-Commerce</h2>

            <p>Thank you for registering. Please click the button below to verify your email address:</p>
            
            <a href="${url}" 
               style="
                    display: inline-block;
                    padding: 12px 24px;
                    background-color: orange;
                    color: white;
                    text-decoration: none;
                    border-radius: 6px;
                    margin-top: 20px;
               ">
                Verify Email
            </a>

            <p style="margin-top: 30px;">If you did not register, please ignore this email.</p>
        </body>
        </html>
    `;
}
