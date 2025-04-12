'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Search, Users } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/auth/user');
        setUsers(res.data);
        console.log('Fetched users:', res.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle search
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="mt-2 text-gray-600">
            Browse all {users.length} users of our community
          </p>
        </div>

        {/* Search box only */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search users by name or username"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Users Grid */}
        {loading ? (
          <div className="text-center py-20">
            <Users className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-pulse" />
            <p className="text-xl font-medium text-gray-700">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <div className="bg-gray-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
              <Users className="h-10 w-10 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              
                <div key={user.id || user._id || user.username} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100">
                  <div className="h-20 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                  <div className="px-6 pb-6">
                    <div className="flex justify-center -mt-10 mb-3">
                      <div className="h-20 w-20 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                        {user.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt={user.name || 'User'} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl font-bold text-gray-500">
                            {(user.name || 'A')[0].toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-gray-900">{user.name || 'Anonymous User'}</h3>
                      {user.username && (
                        <p className="text-gray-500 text-sm">@{user.username}</p>
                      )}
                    </div>
                    
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="font-bold text-blue-600">{user.reputation || 0}</div>
                        <div className="text-xs text-gray-500">Reputation</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="font-bold text-green-600">{user.questions?.length || 0}</div>
                        <div className="text-xs text-gray-500">Questions</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="font-bold text-orange-600">{user.answers?.length || 0}</div>
                        <div className="text-xs text-gray-500">Answers</div>
                      </div>
                    </div>
                    
                    {user.tags && user.tags.length > 0 && (
                      <div className="mt-4">
                        <div className="flex flex-wrap gap-1">
                          {user.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                          {user.tags.length > 3 && (
                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                              +{user.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              
            ))}
          </div>
        )}
        
        {/* Pagination would go here */}
        {!loading && filteredUsers.length > 0 && (
          <div className="mt-8 flex justify-center">
            <button className="px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50">
              Load more users
            </button>
          </div>
        )}
      </div>
    </div>
  );
}