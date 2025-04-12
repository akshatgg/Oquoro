import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all questions sorted by 'createdAt' in descending order
    const questionList = await prisma.question.findMany({
      orderBy: {
        askedOn: 'desc',
      },
      include: {
        author: true, // Assuming you want to include user info for each question
      },
    }); 

    return NextResponse.json(questionList, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 404 });
  }
}
