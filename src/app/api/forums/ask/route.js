import { PrismaClient } from '@prisma/client';
import { getUserIdFromToken } from '@/utils/getUser';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) { 
  const body = await req.json();
  const userId = await getUserIdFromToken();

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const postQuestion = await prisma.question.create({
      data: {
        questionTitle: body.questionTitle,
        questionBody: body.questionBody,
        questionTags: body.questionTags,
        userId: userId,
        userPosted: body.userPosted || '', // Optional field
      },
    });
    console.log('postQuestion', postQuestion);
    
    return NextResponse.json({ message: 'Posted a question successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Couldn't post a new question" }, { status: 409 });
  }
}
