"use client";
import { useEffect, useState } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useApp } from '@/context/AppContext';
import { usePosts } from '@/lib/supabase';
import { SignInPanel } from '@/components/SignInPanel';
import { PostComposer } from '@/components/PostComposer';
import { PostCard } from '@/components/PostCard';
import { SortToggle } from '@/components/SortToggle';
import Link from 'next/link';

// @dev - Connecting a Browser Wallet button
import ConnectWalletButton from '../components/connect-wallets/ConnectWalletButton';
import ConnectWalletButtonWithOnchainkit from '../components/connect-wallets/ConnectWalletButtonWithOnchainkit';

// @dev - Blockchain related imports
import { connectToEvmWallet } from '../lib/blockchains/evm/connect-wallets/connect-to-evm-wallet';
import { BrowserProvider, JsonRpcSigner } from 'ethers';

export default function Home() {
  const { isAuthenticated, anonymousId, companyDomain, signOut } = useApp();
  const [sort, setSort] = useState<'new' | 'hot'>('new');
  const [showSignIn, setShowSignIn] = useState(false);

  // @dev - Fetch from an EVM wallet
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);

  // Fetch posts from Supabase
  const { posts, loading, error, refetch } = usePosts(sort);

  // MiniKit frame lifecycle: signal ready once mounted
  const { setFrameReady, isFrameReady } = useMiniKit(); // @dev - [NOTE]: When the local development, this line, which includes the "setFrameReady", "isFrameReady", "#useMiniKit" should be commented out to avoid an error. (For this line and the lines in the useEffect())

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }

    async function init() {
      const { provider, signer } = await connectToEvmWallet(); // @dev - Connect to EVM wallet (i.e. MetaMask) on page load
      setProvider(provider);
      setSigner(signer);
    }
    init();
  }, [isFrameReady, setFrameReady]);

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
                <h1 className="text-sm font-bold text-gray-900">Feed</h1>
                <p className="text-xs text-gray-500">All Companies</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
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
                // <ConnectWalletButton />
                <ConnectWalletButtonWithOnchainkit />
              )}
            </div>
          </div>
          
          {/* User Info Bar - only show when authenticated */}
          {isAuthenticated && anonymousId && companyDomain && (
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                  {companyDomain}
                </span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-600">{anonymousId}</span>
              </div>
              <div className="flex items-center gap-3">
                <Link 
                  href={`/company/${companyDomain}`}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  My Company →
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Post Composer - only show when authenticated */}
        {isAuthenticated && anonymousId && companyDomain ? (
          <PostComposer onPosted={() => refetch({ silent: true })} />
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
              <PostCard key={post.id} post={post} onLiked={() => refetch({ silent: true })} />
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
              {provider && signer ? (
                <SignInPanel provider={provider} signer={signer} />
              ) : (
                <div className="flex items-center justify-center p-4">
                  <div className="text-gray-500">Loading wallet connection...</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}