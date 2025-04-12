import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(_, { params }) {
  const { id } = params;

  try {
    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        author: {
          select: { name: true, email: true }, // Customize fields
        },
        answers: {
          include: {
            author: {
              select: { name: true },
            },
          },
          orderBy: {
            answeredOn: 'desc',
          },
        },
      },
    });

    if (!question) {
      return NextResponse.json({ message: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json(question, { status: 200 });
  } catch (error) {
    console.error('Get question error:', error);
    return NextResponse.json({ message: 'Error fetching question' }, { status: 500 });
  }
}
