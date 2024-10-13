import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verification.email";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        const response = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Mystry Message | Verification Code',
            react: VerificationEmail({username, otp : verifyCode}),
          });
        console.log(response);
        return { success: true, message: "Verification Email Send Successfully" }
    } catch (error) {
        console.log("Error Sending Verification Email", error);
        return {
            success: false,
            message: "failed to Send Verification Error"
        }
    }
}