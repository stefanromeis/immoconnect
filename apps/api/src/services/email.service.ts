const APP_URL = process.env.APP_URL || "http://localhost:5173";
const IS_DEV = process.env.NODE_ENV !== "production";

export class EmailService {
  async sendMagicLink(email: string, token: string, scope: string): Promise<void> {
    const url = `${APP_URL}/a/${token}`;

    if (IS_DEV) {
      console.log("\n─────────────────────────────────────────");
      console.log(`📧 Magic link for ${email}`);
      console.log(`   Scope: ${scope}`);
      console.log(`   Link:  ${url}`);
      console.log("─────────────────────────────────────────\n");
      return;
    }

    // Production: swap in Resend, Postmark, SES, etc.
    // await resend.emails.send({ from: "...", to: email, subject: "...", html: ... });
    throw new Error("Email provider not configured for production");
  }
}
