"use client";
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { useCompanyPosts } from '@/lib/supabase';
import { PostComposer } from '@/components/PostComposer';
import { PostCard } from '@/components/PostCard';
import { SortToggle } from '@/components/SortToggle';
import Link from 'next/link';

export default function CompanyPage() {
  const params = useParams<{ domain: string }>();
  const domain = params?.domain || '';
  
  const { isAuthenticated, anonymousId, companyDomain, signOut } = useApp();
  const [sort, setSort] = useState<'new' | 'hot'>('new');
  
  // Fetch posts for this specific company
  const { posts, loading, error, refetch } = useCompanyPosts(domain, sort);

  const canPost = isAuthenticated && companyDomain === domain;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-sm text-blue-600 hover:text-blue-800 mb-1 block">
                ← Back to feed
              </Link>
              <h1 className="text-xl font-bold text-gray-900">{domain}</h1>
              <p className="text-sm text-gray-600">Company discussion</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <SortToggle sort={sort} onSortChange={setSort} />
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
                <Link 
                  href="/"
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-4 space-y-6">
        {canPost ? (
          <PostComposer onPosted={() => refetch({ silent: true })} />
        ) : !isAuthenticated ? (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center py-6">
              <p className="text-gray-600 mb-2">
                Sign in to post to this company page.
              </p>
              <Link 
                href="/"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mt-4"
              >
                Sign In to Post
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center py-6">
              <p className="text-gray-600 mb-2">
                Only users from <span className="font-semibold">{domain}</span> can post here.
              </p>
              <p className="text-sm text-gray-500">
                Your company: <span className="font-medium">{companyDomain || 'Unknown'}</span>
              </p>
              {companyDomain && companyDomain !== domain && (
                <Link 
                  href={`/company/${companyDomain}`}
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mt-4"
                >
                  Go to your company page
                </Link>
              )}
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
              <p className="text-sm text-gray-600">Loading posts...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Error loading posts</h3>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <p className="text-gray-500 mb-2">No posts yet for {domain}</p>
              <p className="text-sm text-gray-400">
                {canPost 
                  ? "Be the first to post something!" 
                  : "Check back later for updates from this company."
                }
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} onLiked={() => refetch({ silent: true })} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
