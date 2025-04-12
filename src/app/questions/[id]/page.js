'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function QuestionDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionType, setActionType] = useState(null);

  // Function to fetch question data
  const fetchQuestionData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/forums/questions/${id}`);
      setQuestion(res.data);
      return res.data;
    } catch (error) {
      console.error('Error fetching question data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    const initializeData = async () => {
      await fetchQuestionData();
      
      try {
        const auth = await axios.get('/api/auth/me');
        setUserId(auth.data.id);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    initializeData();
  }, [id]);

  // Handle voting
  const handleVote = async (type) => {
    try {
      setActionType('voting');
      // Send vote to server
      const response = await axios.post(`/api/forums/vote/${id}`, { value: type });
      
      // Always refresh data from server
      await fetchQuestionData();
    } catch (err) {
      console.error('Voting failed:', err);
    } finally {
      setActionType(null);
    }
  };

  // Handle answer submission
  const handleAnswerSubmit = async () => {
    if (!answer.trim()) return;
    
    try {
      setActionType('answering');
      await axios.post(`/api/comments/answer/${id}`, { answerBody: answer });
      await fetchQuestionData();
      setAnswer(''); // Clear input after successful submission
    } catch (err) {
      console.error('Answer submission error:', err);
    } finally {
      setActionType(null);
    }
  };

  // Handle answer deletion
  const handleDeleteAnswer = async (answerId) => {
    try {
      setActionType('deleting');
      await axios.delete(`/api/comments/delete/${id}`, {
        data: { answerId },
      });
      await fetchQuestionData();
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setActionType(null);
    }
  };

  // Show loading state
  if (loading && !question) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Loading question...</p>
        </div>
      </div>
    );
  }

  // Show error state if no question data
  if (!loading && !question) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-red-500">Question not found or error loading data.</p>
          <button 
            onClick={() => router.push('/questions')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Back to Questions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Question Details Card */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">{question.questionTitle}</h1>
          <p className="mt-4 text-gray-700 whitespace-pre-wrap">{question.questionBody}</p>
          
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <span>Asked by: </span>
            <span className="font-medium ml-1">{question.author?.name || 'Anonymous'}</span>
          </div>
          
          {/* Voting Controls */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => handleVote('upVote')}
              disabled={actionType === 'voting'}
              className={`flex items-center gap-1 px-4 py-2 rounded-md ${
                question.upVote.includes(userId)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-green-100'
              }`}
            >
              <span>Upvote</span>
              <span className="font-semibold">({question.upVote.length})</span>
            </button>
            
            <button
              onClick={() => handleVote('downVote')}
              disabled={actionType === 'voting'}
              className={`flex items-center gap-1 px-4 py-2 rounded-md ${
                question.downVote.includes(userId)
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-red-100'
              }`}
            >
              <span>Downvote</span>
              <span className="font-semibold">({question.downVote.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Answer Form */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Answer</h2>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Write your answer here..."
            rows={5}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            disabled={actionType === 'answering'}
          />
          <button
            onClick={handleAnswerSubmit}
            disabled={!answer.trim() || actionType === 'answering'}
            className={`mt-4 px-5 py-2 rounded-md text-white font-medium ${
              !answer.trim() || actionType === 'answering'
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {actionType === 'answering' ? 'Posting...' : 'Post Your Answer'}
          </button>
        </div>
      </div>

      {/* Answers List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span>Answers</span>
            <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-sm font-medium">
              {question.answers.length}
            </span>
          </h2>
          
          <div className="mt-4 divide-y">
            {question.answers.length === 0 ? (
              <div className="py-6 text-center text-gray-500">
                No answers yet. Be the first to answer!
              </div>
            ) : (
              question.answers.map((ans) => (
                <div key={ans.id} className="py-5">
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <p className="text-gray-800 whitespace-pre-wrap">{ans.answerBody}</p>
                      <p className="mt-2 text-sm text-gray-500">
                        Answered by: <span className="font-medium">{ans.author?.name || 'Anonymous'}</span>
                      </p>
                    </div>
                    
                    {ans.userId === userId && (
                      <button
                        onClick={() => handleDeleteAnswer(ans.id)}
                        disabled={actionType === 'deleting'}
                        className="ml-4 text-sm text-red-500 hover:text-red-700"
                      >
                        {actionType === 'deleting' ? 'Deleting...' : 'Delete'}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}