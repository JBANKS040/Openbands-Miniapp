"use client";
import { useEffect, useState } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useApp } from '@/context/AppContext';
import { usePosts, useCompanies } from '@/lib/supabase';
import { SignInPanel } from '@/components/SignInPanel';
import { PostComposer } from '@/components/PostComposer';
import { PostCard } from '@/components/PostCard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// @dev - Connecting a Browser Wallet button
import ConnectWalletButton from '../components/connect-wallets/ConnectWalletButton';

// @dev - Blockchain related imports
import { connectToEvmWallet } from '../lib/blockchains/evm/connect-wallets/connect-to-evm-wallet';
import { BrowserProvider, JsonRpcSigner } from 'ethers';

export default function Home() {
  const { isAuthenticated, anonymousId, companyDomain, signOut } = useApp();
  const [sort, setSort] = useState<'new' | 'hot'>('new');
  const [showSignIn, setShowSignIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const router = useRouter();

  // @dev - Fetch from an EVM wallet
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);

  // Fetch posts from Supabase
  const { posts, loading, error, refetch } = usePosts(sort);
  
  // Fetch companies for search
  const { companies } = useCompanies();

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDropdown) {
        setShowDropdown(false);
      }
      if (showSearchDropdown) {
        setShowSearchDropdown(false);
      }
    };

    if (showDropdown || showSearchDropdown) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showDropdown, showSearchDropdown]);

  // Filter companies based on search query
  const filteredCompanies = companies.filter(company =>
    company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle company selection
  const handleCompanySelect = (company: string) => {
    setSearchQuery('');
    setShowSearchDropdown(false);
    // Navigate to company page using Next.js router
    router.push(`/company/${company}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg text-base font-semibold text-gray-800 hover:bg-gray-200 transition-colors min-w-[80px]"
              >
                <span>{sort === 'new' ? 'New' : 'Hot'}</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showDropdown && (
                <div className="absolute top-full left-0 mt-1 w-28 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  <button
                    onClick={() => {
                      setSort('new');
                      setShowDropdown(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-base font-semibold hover:bg-gray-50 first:rounded-t-lg transition-colors ${
                      sort === 'new' ? 'bg-blue-50 text-blue-700' : 'text-gray-800'
                    }`}
                  >
                    New
                  </button>
                  <button
                    onClick={() => {
                      setSort('hot');
                      setShowDropdown(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-base font-semibold hover:bg-gray-50 last:rounded-b-lg transition-colors ${
                      sort === 'hot' ? 'bg-blue-50 text-blue-700' : 'text-gray-800'
                    }`}
                  >
                    Hot
                  </button>
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-xs">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by company"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchDropdown(e.target.value.length > 0);
                  }}
                  onFocus={() => {
                    if (searchQuery.length > 0) {
                      setShowSearchDropdown(true);
                    }
                  }}
                  className="w-full px-3 py-1.5 pl-8 text-sm bg-gray-100 border-0 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                />
                <svg 
                  className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                
                {/* Search Results Dropdown */}
                {showSearchDropdown && filteredCompanies.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                    {filteredCompanies.slice(0, 10).map((company) => (
                      <button
                        key={company}
                        onClick={() => handleCompanySelect(company)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span className="text-gray-800">{company}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                
                {/* No Results */}
                {showSearchDropdown && searchQuery.length > 0 && filteredCompanies.length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                    <div className="px-3 py-2 text-sm text-gray-500 text-center">
                      No companies found
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Connect Wallet Button */}
            <div className="flex-shrink-0">
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
                <ConnectWalletButton />
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