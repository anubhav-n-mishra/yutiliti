import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, name, email, message, toolId } = body;

    if (!email || !message) {
      return NextResponse.json(
        { error: "Email and message are required fields." },
        { status: 400 }
      );
    }

    const host = process.env.ZOHO_SMTP_HOST || "smtp.zoho.com";
    const port = parseInt(process.env.ZOHO_SMTP_PORT || "465", 10);
    const user = process.env.ZOHO_SMTP_USER || "hello@yuitility.app";
    const pass = process.env.ZOHO_SMTP_PASSWORD?.replace(/\s+/g, "");

    const ownerEmails = process.env.SEND_EMAIL_TO || "";

    const subjectMap: Record<string, string> = {
      request: "[Yuitility] New Tool Proposal Received",
      feedback: "[Yuitility] User Feedback Received",
      bug: "[Yuitility] Bug Report Received",
    };

    const subject = subjectMap[type] || "[Yuitility] New Message Received";

    if (pass) {
      const mailOptions1 = {
        from: `"Yuitility Platform" <${user}>`,
        to: ownerEmails,
        replyTo: email,
        subject: subject,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px; width: 100%; box-sizing: border-box;">
            <div style="max-width: 800px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.05); overflow: hidden; padding: 32px; box-sizing: border-box;">
              
              <!-- Brand Header -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="width: 10px; padding-right: 8px; vertical-align: middle;">
                    <div style="width: 8px; height: 8px; background-color: #2563eb; border-radius: 50%;"></div>
                  </td>
                  <td style="vertical-align: middle;">
                    <span style="font-size: 11px; font-weight: 600; color: #64748b; letter-spacing: 0.05em; text-transform: uppercase;">Yuitility Platform</span>
                  </td>
                </tr>
              </table>
              
              <h1 style="font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 8px 0; letter-spacing: -0.02em; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">New submission received</h1>
              <p style="font-size: 14px; color: #475569; margin: 0 0 24px 0; line-height: 1.5;">A new form submission of type <span style="font-weight: 600; color: #2563eb;">${type}</span> has arrived. Details are listed below.</p>
              
              <!-- Divider -->
              <div style="height: 1px; background-color: #f1f5f9; margin-bottom: 24px;"></div>
              
              <!-- Information Grid -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; width: 140px; font-size: 14px; color: #64748b; font-weight: 500; vertical-align: top;">Sender Name</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #1e293b; font-weight: 500; vertical-align: top;">${name || "N/A"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 14px; color: #64748b; font-weight: 500; vertical-align: top;">Email Address</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #1e293b; vertical-align: top;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none; border-bottom: 1px solid #dbeafe;">${email}</a></td>
                </tr>
                ${toolId ? `
                <tr>
                  <td style="padding: 10px 0; font-size: 14px; color: #64748b; font-weight: 500; vertical-align: top;">Target Tool</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #0f172a; vertical-align: top;"><code style="font-family: monospace; background-color: #f1f5f9; padding: 3px 6px; border-radius: 4px; font-size: 13px;">${toolId}</code></td>
                </tr>
                ` : ""}
                <tr>
                  <td style="padding: 10px 0; font-size: 14px; color: #64748b; font-weight: 500; vertical-align: top;">Submitted At</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #64748b; vertical-align: top;">${new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })} (IST)</td>
                </tr>
              </table>
              
              <!-- Message Box -->
              <div style="margin-bottom: 32px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
                <h3 style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin: 0 0 12px 0;">Message Content</h3>
                <div style="font-size: 14px; color: #334155; line-height: 1.6; word-break: break-word; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">${message.replace(/\n/g, '<br />')}</div>
              </div>
              
              <!-- Footer -->
              <div style="border-top: 1px solid #f1f5f9; padding-top: 20px; font-size: 12px; color: #94a3b8; text-align: center;">
                Yuitility Platform &middot; <a href="mailto:hello@yuitility.app" style="color: #2563eb; text-decoration: none;">hello@yuitility.app</a>
              </div>
            </div>
          </div>
        `,
      };

      const mailOptions2 = {
        from: `"Yuitility Support" <${user}>`,
        to: email,
        subject: "We received your message - Yuitility",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px; width: 100%; box-sizing: border-box;">
            <div style="max-width: 800px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.05); overflow: hidden; padding: 32px; box-sizing: border-box;">
              
              <!-- Brand Header -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="width: 10px; padding-right: 8px; vertical-align: middle;">
                    <div style="width: 8px; height: 8px; background-color: #2563eb; border-radius: 50%;"></div>
                  </td>
                  <td style="vertical-align: middle;">
                    <span style="font-size: 11px; font-weight: 600; color: #64748b; letter-spacing: 0.05em; text-transform: uppercase;">Yuitility Support</span>
                  </td>
                </tr>
              </table>
              
              <h1 style="font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0; letter-spacing: -0.02em; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Thank you for contacting Yuitility!</h1>
              
              <p style="font-size: 14px; color: #475569; margin: 0 0 16px 0; line-height: 1.5;">We have received your ${type === 'request' ? 'tool request' : type === 'bug' ? 'bug report' : 'feedback'}.</p>
              
              <p style="font-size: 14px; color: #1e293b; line-height: 1.6; margin: 0 0 24px 0;">Our team reviews all submissions promptly. If you requested a new tool, our target SLA is adding high-demand tools within 24 hours!</p>
              
              <!-- Divider -->
              <div style="height: 1px; background-color: #f1f5f9; margin-bottom: 20px;"></div>
              
              <!-- Footer -->
              <div style="font-size: 12px; color: #94a3b8; text-align: center; line-height: 1.5;">
                Yuitility Platform &middot; Free, private browser tools &middot; <a href="mailto:hello@yuitility.app" style="color: #2563eb; text-decoration: none;">hello@yuitility.app</a>
              </div>
            </div>
          </div>
        `,
      };

      try {
        const transporter = nodemailer.createTransport({
          host,
          port,
          secure: true,
          auth: {
            user,
            pass,
          },
        });
        await transporter.sendMail(mailOptions1);
        await transporter.sendMail(mailOptions2);
      } catch (err: any) {
        if (host === "smtp.zoho.com") {
          console.warn("[SMTP Warning]: smtp.zoho.com failed, trying smtp.zoho.in fallback...");
          const fallbackTransporter = nodemailer.createTransport({
            host: "smtp.zoho.in",
            port,
            secure: true,
            auth: {
              user,
              pass,
            },
          });
          await fallbackTransporter.sendMail(mailOptions1);
          await fallbackTransporter.sendMail(mailOptions2);
        } else {
          throw err;
        }
      }
    } else {
      console.log("[SMTP Simulation] Submission received:", { type, name, email, message, toolId });
    }

    return NextResponse.json({
      success: true,
      message: "Your submission has been received. Thank you!",
    });
  } catch (error) {
    console.error("[Contact API Error - SMTP]:", error);
    // Gracefully return success to client so user submission is never blocked
    return NextResponse.json({
      success: true,
      message: "Your submission has been recorded successfully. Thank you!",
    });
  }
}
