import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserIdFromToken } from '@/utils/getUser';

const prisma = new PrismaClient();

export async function POST(req, context) {
  const { id } = context.params;
  const { value } = await req.json();
  const userId = await getUserIdFromToken(req);

  try {
    const question = await prisma.question.findUnique({ where: { id } });

    if (!question) {
      return NextResponse.json({ message: 'Question not found' }, { status: 404 });
    }

    const upVotes = question.upVote || [];
    const downVotes = question.downVote || [];

    const alreadyUp = upVotes.includes(userId);
    const alreadyDown = downVotes.includes(userId);

    let updatedUpVotes = [...upVotes];
    let updatedDownVotes = [...downVotes];

    if (value === 'upVote') {
      if (alreadyDown) {
        updatedDownVotes = updatedDownVotes.filter((uid) => uid !== userId);
      }
      if (!alreadyUp) {
        updatedUpVotes.push(userId);
      } else {
        updatedUpVotes = updatedUpVotes.filter((uid) => uid !== userId);
      }
    } else if (value === 'downVote') {
      if (alreadyUp) {
        updatedUpVotes = updatedUpVotes.filter((uid) => uid !== userId);
      }
      if (!alreadyDown) {
        updatedDownVotes.push(userId);
      } else {
        updatedDownVotes = updatedDownVotes.filter((uid) => uid !== userId);
      }
    }

    await prisma.question.update({
      where: { id },
      data: {
        upVote: updatedUpVotes,
        downVote: updatedDownVotes,
      },
    });

    return NextResponse.json({ message: 'Voted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Voting Error:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
