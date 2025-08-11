"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { PostComposer } from '@/components/PostComposer';
import { PostCard } from '@/components/PostCard';
import { SortToggle } from '@/components/SortToggle';
import Link from 'next/link';

export default function CompanyPage() {
  const params = useParams<{ domain: string }>();
  const domain = params?.domain || '';
  
  const user = useAppStore(s => s.user);
  const isAuthenticated = useAppStore(s => s.isAuthenticated);
  const sort = useAppStore(s => s.sort);
  const getPostsByDomain = useAppStore(s => s.getPostsByDomain);
  const signOut = useAppStore(s => s.signOut);
  const version = useAppStore(s => s.version);
  
  const [posts, setPosts] = useState<any[]>([]);

  const canPost = user?.companyDomain === domain;

  useEffect(() => {
    const companyPosts = getPostsByDomain(domain, sort);
    setPosts(companyPosts);
  }, [getPostsByDomain, domain, sort, version]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card text-center">
          <h2 className="text-xl font-semibold mb-4">Sign in required</h2>
          <p className="text-gray-600 mb-4">You need to sign in to view company pages.</p>
          <Link href="/" className="btn-primary">
            Go to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-sm text-blue-600 hover:text-blue-800 mb-1 block">
                ← Back to feed
              </Link>
              <h1 className="text-xl font-bold text-gray-900">{domain}</h1>
              <p className="text-sm text-gray-600">Company discussion</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <SortToggle />
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{user.email}</span>
                <button
                  onClick={signOut}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 space-y-6">
        {canPost ? (
          <PostComposer />
        ) : (
          <div className="card">
            <div className="text-center py-6">
              <p className="text-gray-600 mb-2">
                You can only post to your own company page.
              </p>
              <p className="text-sm text-gray-500">
                Your company: <span className="font-medium">{user.companyDomain}</span>
              </p>
              <Link 
                href={`/company/${user.companyDomain}`}
                className="btn-primary mt-4"
              >
                Go to your company page
              </Link>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="card text-center py-12">
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
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
