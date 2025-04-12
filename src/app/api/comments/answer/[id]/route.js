import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getUserIdFromToken } from '@/utils/getUser';

const prisma = new PrismaClient();

export async function POST(req, context) {
  try {
    // 1. Get the question ID from params
    const { id: questionId } = context.params;
    
    // 2. Parse the request body
    const { answerBody } = await req.json();
    
    // 3. Get the user ID - IMPORTANT: await it!
    const userId = await getUserIdFromToken();
    
    // 4. Get user details for the userAnswered field
    const user = await prisma.user.findUnique({ 
      where: { id: userId },
      select: { name: true }
    });
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    const userAnswered = user.name;

    // 5. Find the question
    const question = await prisma.question.findUnique({ 
      where: { id: questionId } 
    });
    
    if (!question) {
      return NextResponse.json({ message: 'Question not found' }, { status: 404 });
    }

    // 6. Create the answer
    const newAnswer = await prisma.answer.create({
      data: {
        answerBody,
        userAnswered,
        userId,
        questionId,
      },
    });

    // 7. Update the question's answer count
    const answersCount = await prisma.answer.count({ where: { questionId } });
    await prisma.question.update({
      where: { id: questionId },
      data: { noOfAnswers: answersCount },
    });

    return NextResponse.json({ 
      message: 'Answer posted successfully', 
      answer: newAnswer 
    }, { status: 201 });
    
  } catch (error) {
    console.error('Answer Posting Error:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}