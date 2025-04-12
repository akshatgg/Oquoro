import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        joinedOn: 'desc', // Optional: get the newest users first
      },
      include: {
        questions: true, // Optional: include user's questions
        answers: true,   // Optional: include user's answers
      },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
