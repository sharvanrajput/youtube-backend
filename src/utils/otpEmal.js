import { Resend } from "resend";

const resend = new Resend("re_68jRAmLJ_12ywpLdMhiQMZKer7xtU5NTb");

export const SendOtp = async (email, otp) => {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email], // Resend prefers array
      subject: "Your OTP Code (Valid for 10 minutes)",
      html: `
        <h2>Password Reset OTP</h2>
        <p>Your OTP code is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for <b>10 minutes</b>.</p>
        <p>Do not share this OTP with anyone.</p>
      `,
    });

    return true;
  } catch (error) {
    console.error("OTP send error:", error);
    throw new Error("Failed to send OTP email");
  }
};
