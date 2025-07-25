
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AgentLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Mock authentication
    if (credentials.username === 'agent' && credentials.password === 'agent123') {
      localStorage.setItem('agentAuth', 'true');
      localStorage.setItem('agentId', 'Agent001');
      router.push('/agent/dashboard');
    } else {
      setError('Invalid credentials');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Pacifico, serif' }}>
                CourierPro
              </h1>
            </Link>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Agent Login</h2>
            <p className="text-gray-600">Access your agent dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agent ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  placeholder="Enter your agent ID"
                  required
                />
                <i className="ri-user-line w-5 h-5 flex items-center justify-center absolute right-3 top-3 text-gray-400"></i>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  placeholder="Enter your password"
                  required
                />
                <i className="ri-lock-line w-5 h-5 flex items-center justify-center absolute right-3 top-3 text-gray-400"></i>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 font-semibold disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/" className="text-green-600 hover:text-green-800 text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}