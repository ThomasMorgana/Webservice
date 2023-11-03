import { User } from '@prisma/client';

export const resetPassword = (user: User, token: string) => {
  return {
    subject: `Password Reset !`,
    content: `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Password Reset</title>
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
                <h1>Reset Requested</h1>
            </div>
            <div class="content">
                <p>Dear ${user.email},</p>
                <p>Use this token :  ${token}</p>
                <p>Best regards,</p>
                <p>The Webservice Team</p>
            </div>
        </div>
    </body>
    </html>
    `,
  };
};
