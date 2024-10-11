const getUserResetPasswordEmail = (name: string, redirectUrl: string) => `
    <!doctype html>
    <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" style="font-family: 'DM Sans', sans-serif;">
    <head>
        <meta charset="utf-8" />
        <meta name="x-apple-disable-message-reformatting" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no" />
    </head>
    <body style="font-family: 'DM Sans', sans-serif; min-height: fit-content; background-color: #dcd7c959;;">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet" />
        <style>
        * {
            font-family: "DM Sans", sans-serif;
        }
        </style>
        <div style="font-family: 'DM Sans', sans-serif; position: fixed; inset: 0; left: 0; top: 0; z-index: 10; background-image: url('https://mailwind.blob.core.windows.net/website/blurred-background-transparency.jpg')"></div>
        <div style="font-family: 'DM Sans', sans-serif; position: relative; z-index: 20; margin-left: auto; margin-right: auto; max-width: 512px; padding: 40px 16px">
        <div style="font-family: 'DM Sans', sans-serif; background-color: #fff; padding: 40px 25px; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)">
            <h3 style="font-family: 'DM Sans', sans-serif; text-align: center">Reset Your Password</h3>
            <div style="font-family: 'DM Sans', sans-serif; margin-top: -25px">
            <table style="font-family: 'DM Sans', sans-serif; margin-top: 20px;  border-spacing: 1rem; border-collapse: separate;" cellpadding="0" cellspacing="0" role="none">
                <tr style="font-family: 'DM Sans', sans-serif;">
                <td style="font-family: 'DM Sans', sans-serif;">Dear ${name},</td>
                </tr>
                <tr style="font-family: 'DM Sans', sans-serif;">
                <td style="font-family: 'DM Sans', sans-serif;">We received a request to reset your password for your account on <b>BrewTopia</b>. Please click the link below to reset your password:</td>
                </tr>
                <tr style="font-family: 'DM Sans', sans-serif;">
                <td style="font-family: 'DM Sans', sans-serif;">
                    <a href="${redirectUrl}" style="font-family: 'DM Sans', sans-serif; margin-left: auto; margin-right: auto; margin-top: 20px; display: block; width: fit-content; background-color: #A27B5C; padding: 8px 20px; color: #fff; text-decoration-line: none">Reset Password</a>
                </td>
                </tr>
                <tr style="font-family: 'DM Sans', sans-serif;">
                <td style="font-family: 'DM Sans', sans-serif; text-align: center; font-weight: bold;">
                    This link will expire in 15 minutes for your security.
                </td>
                </tr>
                <tr style="font-family: 'DM Sans', sans-serif;">
                <td style="font-family: 'DM Sans', sans-serif;">
                    If you did not request a password reset, please ignore this email
                </td>
                </tr>
            </table>
            </div>
        </div>
        <table style="font-family: 'DM Sans', sans-serif; margin-top: 16px; width: 100%" cellpadding="0" cellspacing="0" role="none">
            <tr style="font-family: 'DM Sans', sans-serif;">
            <td style="font-family: 'DM Sans', sans-serif; width: 100%; text-align: center; font-size: 14px; opacity: 0.5">&copy; BrewTopia ${new Date().getFullYear()}. All rights reserved.</td>
            </tr>
        </table>
        </div>
    </body>
    </html>

`;

export default getUserResetPasswordEmail;
