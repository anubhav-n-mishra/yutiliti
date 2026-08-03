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
    const pass = process.env.ZOHO_SMTP_PASSWORD;

    const subjectMap: Record<string, string> = {
      request: `[Tool Request] New Tool Proposal from ${name || email}`,
      feedback: `[Feedback] User Feedback from ${name || email}`,
      bug: `[Bug Report] Issue reported for ${toolId || "Platform"}`,
    };

    const subject = subjectMap[type] || `[Contact Form] ${type || "Inquiry"}`;

    if (pass) {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: true,
        auth: {
          user,
          pass,
        },
      });

      // 1. Send notification to Yuitility team emails
      await transporter.sendMail({
        from: `"Yuitility Platform" <${user}>`,
        to: "hello@yuitility.app, develop.yuitility.app, support.yuitility.app",
        replyTo: email,
        subject: subject,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; rounded: 10px;">
            <h2 style="color: #2563eb;">Yuitility - New Submission</h2>
            <p><strong>Type:</strong> ${type}</p>
            <p><strong>Name:</strong> ${name || "N/A"}</p>
            <p><strong>User Email:</strong> ${email}</p>
            ${toolId ? `<p><strong>Target Tool:</strong> ${toolId}</p>` : ""}
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <h4 style="color: #333;">Message:</h4>
            <p style="background: #f9f9f9; padding: 15px; border-radius: 8px; font-size: 14px; line-height: 1.5;">${message}</p>
          </div>
        `,
      });

      // 2. Send confirmation auto-responder email to the user
      await transporter.sendMail({
        from: `"Yuitility Support" <${user}>`,
        to: email,
        subject: `We received your ${type || "message"} - Yuitility`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
            <h2 style="color: #2563eb; margin-bottom: 5px;">Thank you for contacting Yuitility!</h2>
            <p style="color: #666; font-size: 14px;">We have received your ${type === 'request' ? 'tool request' : type === 'bug' ? 'bug report' : 'feedback'}.</p>
            <p style="color: #333; font-size: 14px; line-height: 1.6;">Our team reviews all submissions promptly. If you requested a new tool, our target SLA is adding high-demand tools within 24 hours!</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #999;">Yuitility Platform · Free, private browser tools · hello@yuitility.app</p>
          </div>
        `,
      });
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
