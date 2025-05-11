const VerificationEmail = (username, otp) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Email Verification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #eaeaea;
          }
          .header h1 {
            color: #333;
          }
          .content {
            padding: 20px 0;
            text-align: center;
          }
          .otp {
            display: inline-block;
            font-size: 28px;
            letter-spacing: 4px;
            font-weight: bold;
            background-color: #f0f0f0;
            padding: 10px 20px;
            border-radius: 6px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            padding-top: 20px;
            border-top: 1px solid #eaeaea;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Email Verification</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${username}</strong>,</p>
            <p>Thank you for signing up. Please use the OTP below to verify your email address:</p>
            <div class="otp">${otp}</div>
            <p>This code will expire in 10 minutes.</p>
          </div>
          <div class="footer">
            <p>If you did not request this, please ignore this email.</p>
          </div>
        </div>
      </body>
    </html>
    `;
};
export default VerificationEmail;
