import { errorHandler, errorMessages } from '@/helper/api/error-handler';
import db from '@/lib/db';
import { z } from 'zod';
import { safeParse } from 'zod-error';

const otpVerificationValidation = z.object({
  email: z.string().email(),
  otp_key: z.string(), // Changed to string to match UUID format
  otp: z.string().min(6).max(6),
});

export async function POST(req) {
  try {
    const body = await req.json();
    console.log('🚀 ~ POST ~ body:', body);
    const validationRes = safeParse(otpVerificationValidation, body);
    console.log('🚀 ~ POST ~ validationRes:', validationRes);

    if (!validationRes.success) {
      const { error } = validationRes;
      req.error = error;
      throw new Error(errorMessages.validationError);
    }

    const { email, otp_key, otp } = validationRes.data;

    // Find the OTP entry
    const otpEntry = await db.otp.findUnique({
      where: {
        id: otp_key,
      },
    });
    console.log('🚀 ~ POST ~ otpEntry:', otpEntry);
    
    if (!otpEntry) {
      throw new Error('Invalid OTP key');
    }

    // Check if OTP is already used
    if (otpEntry.used) {
      throw new Error('OTP has already been used');
    }

    // Check if OTP is expired
    const currentTime = new Date();
    if (currentTime > otpEntry.expiresAt) {
      throw new Error('OTP has expired');
    }

    // Validate OTP value    
    if (otpEntry.otp !== otp) {
      throw new Error('Invalid OTP');
    }

    // Find the user to verify
    const user = await db.user.findFirst({
      where: {
        id: otpEntry.userId,
        email: email,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Update user verification status
    // Note: You may need to add a 'verified' field to your User model if not present
    const updatedUser = await db.user.update({
      where: {
        id: otpEntry.userId,
      },
      data: {
        verified: true,
      },
    });

    if (!updatedUser) {
      throw new Error('Failed to verify user');
    }

    // Mark OTP as used
    await db.otp.update({
      where: {
        id: otp_key,
      },
      data: {
        used: true,
      },
    });

    return new Response(
      JSON.stringify({
        status: 200,
        message: `User is successfully verified!`,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.log('🚀 ~ POST ~ err:', err);
    return errorHandler(err, req);
  }
}