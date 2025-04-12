'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Search } from 'lucide-react';

export default function ForumsPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [actionInProgress, setActionInProgress] = useState({ type: null, id: null });
  const [searchTerm, setSearchTerm] = useState('');

  // Function to fetch all questions
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/forums/questions');
      setQuestions(res.data);
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get current user
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get('/api/auth/me');
        setUserId(res.data.id);
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    // fetchUserData();
    fetchQuestions();
  }, []);

  // Handle voting
  const handleVote = async (id, type) => {
    // Prevent duplicate actions
    if (actionInProgress.type === 'voting' && actionInProgress.id === id) return;
    
    try {
      setActionInProgress({ type: 'voting', id });
      
      // Send vote request
      const response = await axios.post(`/api/forums/vote/${id}`, { value: type });
      
      // Update questions state with the returned question or refetch
      if (response.data.question) {
        setQuestions(prev => 
          prev.map(q => q.id === id ? response.data.question : q)
        );
      } else {
        // Fallback to refreshing all questions
        await fetchQuestions();
      }
    } catch (err) {
      console.error('Voting error:', err);
    } finally {
      setActionInProgress({ type: null, id: null });
    }
  };

  // Handle question deletion
  const handleDelete = async (id) => {
    if (actionInProgress.type === 'deleting' && actionInProgress.id === id) return;
    
    if (!confirm('Are you sure you want to delete this question?')) return;
    
    try {
      setActionInProgress({ type: 'deleting', id });
      await axios.delete(`/api/forums/delete/${id}`);
      setQuestions(prev => prev.filter(q => q.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setActionInProgress({ type: null, id: null });
    }
  };

  // Filter questions based on search term
  const filteredQuestions = questions.filter(question => 
    question.questionTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading state
  if (loading && questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Community Forums</h1>
        <div className="text-center py-12">
          <p className="text-gray-500">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Community Forums</h1>
        <Link 
          href="/questions/ask" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-colors"
        >
          Ask a Question
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search questions by title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredQuestions.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          {questions.length === 0 ? (
            <>
              <p className="text-gray-500">No questions have been asked yet.</p>
              <p className="mt-2 text-gray-600">Be the first to ask a question!</p>
            </>
          ) : (
            <>
              <p className="text-gray-500">No questions match your search.</p>
              <p className="mt-2 text-gray-600">Try a different search term or browse all questions.</p>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="mt-4 text-blue-600 hover:text-blue-800"
                >
                  Clear search
                </button>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredQuestions.map(q => (
            <div key={q.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <Link href={`/questions/${q.id}`}>
                  <h2 className="text-xl font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                    {q.questionTitle}
                  </h2>
                </Link>
                
                <p className="mt-2 text-gray-700 line-clamp-2">
                  {q.questionBody}
                </p>
                
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-gray-500">Asked by: </span>
                  <span className="ml-1 font-medium">{q.author?.name || 'Anonymous'}</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-gray-500">
                    {q.noOfAnswers} {q.noOfAnswers === 1 ? 'answer' : 'answers'}
                  </span>
                </div>
                
                <div className="mt-4 flex items-center gap-3">
                  <button 
                    onClick={() => handleVote(q.id, 'upVote')}
                    disabled={actionInProgress.type === 'voting' && actionInProgress.id === q.id}
                    className={`flex items-center px-3 py-1.5 rounded-md transition-colors ${
                      q.upVote.includes(userId) 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-600'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{q.upVote.length}</span>
                  </button>
                  
                  <button 
                    onClick={() => handleVote(q.id, 'downVote')}
                    disabled={actionInProgress.type === 'voting' && actionInProgress.id === q.id}
                    className={`flex items-center px-3 py-1.5 rounded-md transition-colors ${
                      q.downVote.includes(userId) 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{q.downVote.length}</span>
                  </button>
                  
                  {q.userId === userId && (
                    <button 
                      onClick={() => handleDelete(q.id)}
                      disabled={actionInProgress.type === 'deleting' && actionInProgress.id === q.id}
                      className="ml-auto text-gray-500 hover:text-red-600 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
                    >
                      {actionInProgress.type === 'deleting' && actionInProgress.id === q.id 
                        ? 'Deleting...' 
                        : 'Delete'}
                    </button>
                  )}
                  
                  <Link 
                    href={`/questions/${q.id}`}
                    className="text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}