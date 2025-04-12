import { errorHandler, errorMessages } from '@/helper/api/error-handler';
import { prisma } from '@/lib/db'; // ✅ if you're using named export

import bcrypt from 'bcrypt';
import { z } from 'zod';
import crypto from 'crypto';
import { safeParse } from 'zod-error';
import EmailService, { emailTypes } from '@/lib/mailingService';

const signupValidation = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().min(10).max(10).optional(),
  about: z.string().optional(),
  tags: z.array(z.string()).optional()
});

export async function POST(req) {
  try {
    const body = await req.json();
    const validationRes = safeParse(signupValidation, body);

    if (!validationRes.success) {
      const { error } = validationRes;
      req.error = error;
      throw new Error(errorMessages.validationError);
    }

    const { name, email, password, about, tags } = validationRes.data;

    const isExistingUser = await prisma.user.findFirst({ where: { email } });

    if (isExistingUser) {
      throw new Error(errorMessages.conflict);
    }

    const hashedPwd = await bcrypt.hash(password, 10);
    
    // Create user with the fields from our Prisma schema
    const user = await prisma.user.create({
      data: {
        name: name || email.split('@')[0],
        email,
        password: hashedPwd,
        about: about || null,
        tags: tags || [],
        // joinedOn will be automatically set to now() by Prisma
      },
    });

    const otpValue = crypto.randomInt(100000, 1000000).toString();
    
    // Create OTP entry
    // Note: You may need to add an OTP model to your schema if not already present
    const otp = await prisma.otp.create({
      data: {
        userId: user.id,
        otp: otpValue,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiry
      },
    });

    if (user && otp) {
      // Send OTP via email
      const emailResult = await EmailService.sendMail(
        email,
        `${emailTypes.email}`,
        `Your one time password is: ${otpValue} | Do not share your OTP | This is valid for 10 minutes only.`,
      );

      return new Response(
        JSON.stringify({
          status: 201,
          message: `User created successfully.`,
          data: {
            otp_key: otp.id,
          },
        }),
        { status: 201 },
      );
    }
    throw new Error(errorMessages.serverError);
  } catch (err) {
    console.log('🚀 ~ POST ~ err:', err);
    return errorHandler(err, req);
  }
}