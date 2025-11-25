export const resetPasswordTemplate = (
    resetLink: string,
    userName: string,
    expiryTime: string
) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Reset Your Password</title>
</head>
<body style="margin:0; min-height:100vh; padding:0;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
 <div style="padding:10px 0;">
    <div style="max-width:600px;margin:0 auto;">
      <div style="background:rgba(255,255,255,0.15);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid #D3D3D3;border-radius:16px;overflow:hidden;">
        <div style="background:rgba(255,255,255,0.1);padding:24px;text-align:center;border-bottom:1px solid rgba(211,211,211,0.3);">
          <h1 style="margin:0 0 8px 0;font-size:32px;font-weight:700;color:#0054A5;line-height:1.2;">
            Reset Password
          </h1>
          <p style="margin:0;font-size:14px;color:#64748B;font-weight:500;">
            Don't worry, it happens to the best of us
          </p>
        </div>

        <div style="padding:32px;">
          <div style="background:rgba(255,255,255,0.1);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);padding:10px;margin-bottom:24px;">
            <p style="margin:0 0 12px 0;font-size:16px;font-weight:600;color:#0054A5;">
              Hi ${userName} 👋
            </p>
            <p style="margin:0;font-size:14px;line-height:1.6;color:#64748B;font-weight:500;">
              We received a request to reset your password. Click the button below to create a new one.
            </p>
          </div>

          <div style="text-align:center;margin:25px 0;">
            <Link href="${resetLink}" style="display:inline-block;padding:10px 30px;background:#0054A5;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;border-radius:1000px;">
              Reset My Password
            </a>
          </div>

          <div style="display:flex;align-items:flex-start;gap:12px;background:rgba(239,68,68,0.05);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(239,68,68,0.2);border-radius:12px;padding:10px 15px;margin-bottom:10px;">
            <p style="margin:0;font-size:13px;color:#64748B;line-height:1.6;font-weight:500;">
              <strong style="color:#EF4444;">Important:</strong> This link will expire in 
              <strong style="color:#0054A5;">${expiryTime}</strong>. 
              Please reset your password soon!
            </p>
          </div>

          <div style="background:rgba(255,255,255,0.1);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid #D3D3D3;border-radius:12px;padding:16px;">
            <p style="margin:0 0 8px 0;font-size:13px;font-weight:600;color:#0054A5;">
              🛡️ Didn't request this?
            </p>
            <p style="margin:0;font-size:12px;line-height:1.6;color:#64748B;font-weight:500;">
              If you didn't request a password reset, please ignore this email. Your password will remain unchanged and your account is secure.
            </p>
          </div>
        </div>


        <div style="background:rgba(255,255,255,0.1);border-top:1px solid rgba(211,211,211,0.3);padding:10px 24px;text-align:center;">
          <p style="margin:10px 0;font-size:13px;color:#0054A5;font-weight:600;">
            Need help? We're here!
          </p>

          <div style="margin-bottom:16px;">
            <Link href="mailto:rnd@bncc.net" style="display:inline-block;margin:0 8px;color:#0054A5;font-size:12px;text-decoration:none;padding:8px 16px;background:rgba(255,255,255,0.15);border-radius:8px;border:1px solid #D3D3D3;font-weight:600;">
              📧 Email Support
            </a>
            <Link href="https://www.bncc.net" style="display:inline-block;margin:0 8px;color:#0054A5;font-size:12px;text-decoration:none;padding:8px 16px;background:rgba(255,255,255,0.15);border-radius:8px;border:1px solid #D3D3D3;font-weight:600;">
              🌐 Visit Website
            </a>
          </div>

          <div>
            <p style="margin:0 0 8px 0;font-size:11px;color:#64748B;line-height:1.5;font-weight:500;">
              Copyright 2025 bncc.in | All Rights Reserved
            </p>
          </div>
        </div>
      </div>

      <div style="margin-top:24px;text-align:center;">
        <p style="margin:0;font-size:11px;color:#64748B;font-weight:500;">
          This is an automated message. Please do not reply.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;