import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function DELETE(_, { params }) {
  const { id } = params;

  try {
    // Delete the question by ID using Prisma
    const deletedQuestion = await prisma.question.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Successfully deleted...' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Question not found' }, { status: 404 });
  }
}
