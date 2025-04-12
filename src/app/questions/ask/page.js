
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function AskQuestionPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const questionData = {
        questionTitle: title,
        questionBody: body,
        questionTags: tags.split(',').map(t => t.trim()),
        userPosted: 'Anonymous',
        userId: 'dummy-user-id' // Replace with real auth
      };
      await axios.post('/api/forums/ask', questionData);
      router.push('/questions');
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ask a New Question</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label className="block font-medium">Body</label>
          <textarea value={body} onChange={e => setBody(e.target.value)} className="w-full border p-2 rounded" rows={5} required />
        </div>
        <div>
          <label className="block font-medium">Tags (comma separated)</label>
          <input type="text" value={tags} onChange={e => setTags(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Post Question</button>
      </form>
    </div>
  );
}
