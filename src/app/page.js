'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  // State for questions fetched from API
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  // Sample stats data - these would come from your API in a real app
  const stats = {
    questions: 21000000,
    answers: 31000000,
    users: 1500000,
    dailyVisits:100
  };

  // Sample tags for the homepage
  const popularTags = [
    { name: "javascript", count: 2347 },
    { name: "react", count: 1856 },
    { name: "next.js", count: 1324 },
    { name: "node.js", count: 987 },
    { name: "css", count: 876 },
    { name: "tailwind", count: 743 },
    { name: "prisma", count: 543 },
    { name: "mongodb", count: 432 }
  ];

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/forums/questions');
        setQuestions(res.data);
        console.log('Fetched questions:', res.data);
        
      } catch (err) {
        console.error('Error fetching questions:', err);
      } finally {
        setLoading(false);
      }
    };
    const fetchAnswers= async () => {
      try{
        setLoading(true);
        // Fetch answers from API
          const res = await axios.get('/api/comments/answer');
          setAnswers(res.data);
          console.log('Fetched answers:', res.data);
      }catch(err){
        console.error('Error fetching questions:', err);
      }finally {
        setLoading(false);
      }
    }
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/api/auth/user');
        setUsers(res.data);
        console.log('Fetched users:', res.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    }
    fetchUsers();
    fetchQuestions();
    fetchAnswers();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">
                The knowledge-sharing community for developers
              </h1>
              <p className="text-xl mb-8">
                Get answers to your toughest coding questions, share knowledge with your peers, and advance your career.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/questions"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Browse Questions
                </Link>
                <Link 
                  href="/questions/ask"
                  className="bg-white hover:bg-gray-100 text-blue-900 px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Ask a Question
                </Link>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
                <h3 className="text-blue-900 font-bold mb-4">Example Question</h3>
                <div className="text-gray-800">
                  <h4 className="font-medium">How do I create a responsive grid layout in Tailwind CSS?</h4>
                  <div className="mt-4 flex gap-2">
                    {["tailwind", "css", "responsive-design"].map(tag => (
                      <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{questions.length}</div>
              <div className="text-gray-600">Questions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{answers.length}</div>
              <div className="text-gray-600">Answers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{users.length}</div>
              <div className="text-gray-600">Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats.dailyVisits.toLocaleString()}</div>
              <div className="text-gray-600">Daily Visits</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Hot Questions */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                  <h2 className="text-xl font-bold text-gray-800">Hot Questions</h2>
                </div>
                
                {loading ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Loading questions...</p>
                  </div>
                ) : questions.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No questions have been asked yet.</p>
                    <p className="mt-2 text-gray-600">Be the first to ask a question!</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {questions.slice(0, 4).map(question => (
                      <li key={question.id} className="px-6 py-5 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start">
                          <div className="hidden sm:flex flex-col items-center mr-4 text-center">
                            <div className="text-gray-700 mb-1">
                              <span className="font-medium">{question.upVote.length - question.downVote.length}</span>
                              <div className="text-xs text-gray-500">votes</div>
                            </div>
                            <div className={`text-sm ${question.noOfAnswers > 0 ? 'text-green-700 bg-green-100' : 'text-gray-700 bg-gray-100'} px-2 py-1 rounded`}>
                              <span className="font-medium">{question.noOfAnswers}</span>
                              <div className="text-xs">answers</div>
                            </div>
                          </div>
                          <div className="flex-1">
                            <Link href={`/questions/${question.id}`} className="text-blue-600 hover:text-blue-800 text-lg font-medium">
                              {question.questionTitle}
                            </Link>
                            <div className="mt-2 line-clamp-2 text-gray-700">
                              {question.questionBody}
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {/* Display tags if available */}
                              {question.tags && question.tags.map(tag => (
                                <Link key={tag} href={`/tags/${tag}`} className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-2 py-1 rounded-md text-xs">
                                  {tag}
                                </Link>
                              ))}
                            </div>
                            <div className="mt-2 flex items-center text-xs text-gray-500">
                              <span className="mr-3">{question.views || 0} views</span>
                              <span>asked by {question.author?.name || 'Anonymous'}</span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <Link href="/questions" className="text-blue-600 hover:text-blue-800 font-medium">
                    View all questions →
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* About Box */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                  <h2 className="text-xl font-bold text-gray-800">About</h2>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 mb-4">
                    Your App is a community-driven Q&A platform where developers can ask questions, share knowledge, and build their careers.
                  </p>
                  <Link href="/about" className="text-blue-600 hover:text-blue-800 font-medium">
                    Learn more about us
                  </Link>
                </div>
              </div>

              {/* Popular Tags */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                  <h2 className="text-xl font-bold text-gray-800">Popular Tags</h2>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map(tag => (
                      <Link
                        key={tag.name}
                        href={`/`}
                        className="group flex justify-between items-center bg-gray-100 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors"
                      >
                        <span className="text-gray-800 group-hover:text-blue-800">{tag.name}</span>
                      
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Call to Action */}
            
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold mb-4">Your App</h3>
              <p className="text-sm">
                A community-based space to find and contribute answers to technical challenges.
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Navigation</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li><Link href="/questions" className="hover:text-white">Questions</Link></li>
                <li><Link href="/tags" className="hover:text-white">Tags</Link></li>
                <li><Link href="/users" className="hover:text-white">Users</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Social</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-sm text-center">
            <p>© {new Date().getFullYear()} Your App. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}