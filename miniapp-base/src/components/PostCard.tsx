"use client";
import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import type { Post } from '@/lib/types';
import { CommentsModal } from './CommentsModal';
import Link from 'next/link';
import { useOpenUrl } from '@coinbase/onchainkit/minikit';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const likePost = useAppStore(s => s.likePost);
  const getCommentsByPost = useAppStore(s => s.getCommentsByPost);
  const version = useAppStore(s => s.version);
  const openUrl = useOpenUrl();
  
  const comments = useMemo(() => getCommentsByPost(post.id), [getCommentsByPost, post.id, version]);

  const handleLike = () => {
    likePost(post.id);
  };

  const timeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <>
      <article className="bg-white rounded-lg shadow-sm border p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-xs">
                {post.authorAnonymousId.charAt(0)}
              </span>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {post.authorAnonymousId}
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Link
                  href={`/company/${post.companyDomain}`}
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                >
                  {post.companyDomain}
                </Link>
                <span>•</span>
                <span>{timeAgo(post.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-3">
          <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 text-sm ${
                post.likeCount > 0 
                  ? 'text-blue-600 hover:text-blue-700' 
                  : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              <svg className="w-4 h-4" fill={post.likeCount > 0 ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{post.likeCount}</span>
            </button>

            <button
              onClick={() => setShowComments(true)}
              className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{post.commentCount}</span>
            </button>
            <button
              onClick={() => void openUrl(`https://warpcast.com/~/compose?text=${encodeURIComponent(`Someone @ ${post.companyDomain} posted: ${post.content.substring(0, 180)}…`)}&embeds[]=${encodeURIComponent(process.env.NEXT_PUBLIC_URL || '')}`)}
              className="flex items-center space-x-1 text-sm text-gray-500 hover:text-purple-600"
              title="Share on Farcaster"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <span>Share</span>
            </button>
          </div>

          {comments.length > 0 && (
            <button
              onClick={() => setShowComments(true)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              View comments
            </button>
          )}
        </div>
      </article>

      <CommentsModal
        post={post}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
      />
    </>
  );
}
