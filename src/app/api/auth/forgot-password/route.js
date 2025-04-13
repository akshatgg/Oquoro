import { errorHandler, errorMessages } from '@/helper/api/error-handler';
import { prisma } from '@/lib/db';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import EmailService, { emailTypes } from '@/lib/mailingService';
import { z } from 'zod';
import { safeParse } from 'zod-error';

// Validation schemas
const requestOtpSchema = z.object({
  email: z.string().email()
});

const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp_key: z.string(),
  otp: z.string()
});

const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp_key: z.string(),
  otp: z.string(),
  newPassword: z.string().min(8).max(30)
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { action } = body;

    // Step 1: Request OTP by providing email
    if (action === 'request_otp') {
      const validationRes = safeParse(requestOtpSchema, body);
      
      if (!validationRes.success) {
        req.error = validationRes.error;
        throw new Error(errorMessages.validationError);
      }

      const { email } = validationRes.data;

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Generate OTP
      const otpValue = crypto.randomInt(100000, 1000000).toString();
      
      // Create OTP entry
      const otp = await prisma.otp.create({
        data: {
          userId: user.id,
          otp: otpValue,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiry
        },
      });

      // Send OTP via email
      await EmailService.sendMail(
        email,
        `${emailTypes.email}`,
        `Your password reset code is: ${otpValue} | Do not share your OTP | This is valid for 10 minutes only.`
      );

      return new Response(
        JSON.stringify({
          status: 200,
          message: 'OTP sent successfully to your email',
          data: {
            otp_key: otp.id,
          },
        }),
        { status: 200 }
      );
    }
    
    // Step 2: Verify OTP without changing password
    else if (action === 'verify_otp') {
      const validationRes = safeParse(verifyOtpSchema, body);
      
      if (!validationRes.success) {
        req.error = validationRes.error;
        throw new Error(errorMessages.validationError);
      }

      const { email, otp_key, otp } = validationRes.data;

      const isOtp = await prisma.otp.findFirst({
        where: {
          id: otp_key,
        },
        include: {
          user: true
        }
      });

      if (!isOtp) {
        throw new Error('Invalid OTP key');
      }

      // Verify the OTP belongs to the user with this email
      if (isOtp.user.email !== email) {
        throw new Error('OTP not associated with this email');
      }

      const currentTime = new Date();
      if (currentTime > isOtp.expiresAt || isOtp.used === true) {
        throw new Error('OTP expired');
      }

      if (isOtp.otp !== otp) {
        throw new Error('Invalid OTP');
      }

      return new Response(
        JSON.stringify({
          status: 200,
          message: 'OTP verified successfully',
          data: {
            verified: true
          },
        }),
        { status: 200 }
      );
    }
    
    // Step 3: Reset password with verified OTP
    else if (action === 'reset_password') {
      const validationRes = safeParse(resetPasswordSchema, body);
      
      if (!validationRes.success) {
        req.error = validationRes.error;
        throw new Error(errorMessages.validationError);
      }

      const { email, otp_key, otp, newPassword } = validationRes.data;

      const isOtp = await prisma.otp.findFirst({
        where: {
          id: otp_key,
        },
        include: {
          user: true
        }
      });

      if (!isOtp) {
        throw new Error('Invalid OTP key');
      }

      // Verify the OTP belongs to the user with this email
      if (isOtp.user.email !== email) {
        throw new Error('OTP not associated with this email');
      }

      const currentTime = new Date();
      if (currentTime > isOtp.expiresAt || isOtp.used === true) {
        throw new Error('OTP expired');
      }

      if (isOtp.otp !== otp) {
        throw new Error('Invalid OTP');
      }

      // Hash the new password
      const hashedPwd = await bcrypt.hash(newPassword, 10);

      // Update user password
      const updatedUser = await prisma.user.update({
        where: {
          id: isOtp.userId,
          email: email,
        },
        data: {
          password: hashedPwd,
        },
      });

      if (!updatedUser) {
        throw new Error('Failed to update password');
      }

      // Mark OTP as used
      await prisma.otp.update({
        where: {
          id: isOtp.id,
        },
        data: {
          used: true,
        },
      });

      return new Response(
        JSON.stringify({
          status: 200,
          message: 'Password reset successfully',
        }),
        { status: 200 }
      );
    }
    
    else {
      throw new Error('Invalid action');
    }
  } catch (err) {
    console.log('🚀 ~ POST ~ err:', err);
    return errorHandler(err, req);
  }
}