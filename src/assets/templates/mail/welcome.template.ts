import { User } from '@prisma/client';

export const welcomeUser = (user: User, activationCode: string) => {
  return {
    subject: `Welcome !`,
    content: `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Welcome to Our Service</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                text-align: center;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                background-color: #008CBA;
                color: #fff;
                padding: 20px 0;
            }
            .content {
                background-color: #ffffff;
                padding: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Welcome to Our Service</h1>
            </div>
            <div class="content">
                <p>Dear ${user.email},</p>
                <p>Thank you for creating an account with us! We are excited to have you on board.</p>
                <p>Your account is now ready to use. Here's what you can do:</p>
                <ul>
                    <li>Access all the great features of our service.</li>
                    <li>Customize your profile and preferences.</li>
                    <li>Start enjoying our amazing content.</li>
                </ul>
                <p>Here is your activation code : ${activationCode},</p>
                <p>If you have any questions or need assistance, please don't hesitate to contact our support team. We're here to help.</p>
                <p>Thank you again for choosing us. We look forward to serving you!</p>
                <p>Best regards,</p>
                <p>The Webservice Team</p>
            </div>
        </div>
    </body>
    </html>
    `,
  };
};
