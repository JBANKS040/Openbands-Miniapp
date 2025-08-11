"use client";
import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { SignInPanel } from '@/components/SignInPanel';
import { PostComposer } from '@/components/PostComposer';
import { PostCard } from '@/components/PostCard';
import { SortToggle } from '@/components/SortToggle';
import type { Post } from '@/lib/types';
import Link from 'next/link';

export default function Home() {
  const user = useAppStore(s => s.user);
  const isAuthenticated = useAppStore(s => s.isAuthenticated);
  const sort = useAppStore(s => s.sort);
  const getAllPosts = useAppStore(s => s.getAllPosts);
  const signOut = useAppStore(s => s.signOut);
  const version = useAppStore(s => s.version);
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [showSignIn, setShowSignIn] = useState(false);

  useEffect(() => {
    const allPosts = getAllPosts(sort);
    setPosts(allPosts);
  }, [getAllPosts, sort, version]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-sm font-bold text-gray-900">OpenBands</h1>
                <p className="text-xs text-gray-500">All Companies</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <SortToggle />
              {isAuthenticated ? (
                <button
                  onClick={signOut}
                  className="p-1 hover:bg-gray-100 rounded"
                  aria-label="Sign out"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => setShowSignIn(true)}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
          
          {/* User Info Bar - only show when authenticated */}
          {isAuthenticated && user && (
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                  {user.companyDomain}
                </span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-600">{user.anonymousId}</span>
              </div>
              <Link 
                href={`/company/${user.companyDomain}`}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                My Company →
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Post Composer - only show when authenticated */}
        {isAuthenticated && user ? (
          <PostComposer />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Want to share something?</h3>
              <p className="text-xs text-gray-600 mb-3">Sign in with your work email to post</p>
              <button
                onClick={() => setShowSignIn(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Sign In to Post
              </button>
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-sm text-gray-600 mb-4">Be the first to share something!</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
      </main>

      {/* Sign In Modal */}
      {showSignIn && !isAuthenticated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowSignIn(false)} />
          <div className="relative bg-white rounded-lg shadow-xl max-w-sm w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Sign In</h2>
                <button
                  onClick={() => setShowSignIn(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <SignInPanel />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}