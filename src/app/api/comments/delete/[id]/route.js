export async function DELETE(req, { params }) {
    const { id: answerId } = params;
    const userId = await getUserIdFromToken(req);
  
    try {
      const answer = await prisma.answer.findUnique({ where: { id: answerId } });
  
      if (!answer) {
        return NextResponse.json({ message: 'Answer not found' }, { status: 404 });
      }
  
      if (answer.userId !== userId) {
        return NextResponse.json({ message: 'Unauthorized: You can only delete your own answer.' }, { status: 403 });
      }
  
      await prisma.answer.delete({ where: { id: answerId } });
  
      // Update the number of answers for the question
      const answersCount = await prisma.answer.count({ where: { questionId: answer.questionId } });
      await prisma.question.update({
        where: { id: answer.questionId },
        data: { noOfAnswers: answersCount },
      });
  
      return NextResponse.json({ message: 'Answer deleted successfully.' }, { status: 200 });
    } catch (error) {
      console.error('Answer Deletion Error:', error);
      return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
    }
  }
  