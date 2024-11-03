const getUserVerificationEmail = (redirectUrl: string) => `
    <!DOCTYPE html>
    <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" style="font-family: 'DM Sans', sans-serif;">
    <head>
      <meta charset="utf-8">
      <meta name="x-apple-disable-message-reformatting">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no">
    </head>
    <body style="font-family: 'DM Sans', sans-serif; min-height: fit-content; background-color: #dcd7c959;;">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet">
      <style>
        * {
          font-family: "DM Sans", sans-serif;
        }
      </style>
      <div style="font-family: 'DM Sans', sans-serif; position: fixed; inset: 0; left: 0; top: 0; z-index: 10; background-image: url('https://mailwind.blob.core.windows.net/website/blurred-background-transparency.jpg')"></div>
      <div style="font-family: 'DM Sans', sans-serif; position: relative; z-index: 20; margin-left: auto; margin-right: auto; max-width: 512px; padding: 40px 16px">
        <div style="font-family: 'DM Sans', sans-serif; border-radius: 8px; background-color: #fff; padding: 40px 16px; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)">
          <h3 style="font-family: 'DM Sans', sans-serif; text-align: center">
            Verify Your Email Address
          </h3>
          <div style="font-family: 'DM Sans', sans-serif; margin-top: 20px">
            <table style="font-family: 'DM Sans', sans-serif; margin-top: 20px;" cellpadding="0" cellspacing="0" role="none">
              <tr style="font-family: 'DM Sans', sans-serif;">
                <td style="font-family: 'DM Sans', sans-serif; text-align: center;">
                  Thank you for registering with <span style="font-family: 'DM Sans', sans-serif; font-weight: 600">BrewTopia</span>! Please click the button below to verify your email address and complete your registration.
                </td>
              </tr>
              <tr style="font-family: 'DM Sans', sans-serif;">
                <td style="font-family: 'DM Sans', sans-serif; text-align: center;">
                  <a href="${redirectUrl}" style="font-family: 'DM Sans', sans-serif; margin-left: auto; margin-right: auto; margin-top: 20px; display: block; width: fit-content; background-color: #A27B5C; padding: 8px 20px; text-align: center; color: #fff; text-decoration-line: none">Verify email</a>
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
export default getUserVerificationEmail;
