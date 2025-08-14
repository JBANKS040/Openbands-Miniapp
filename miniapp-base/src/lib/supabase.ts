"use client";
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect, useCallback } from 'react';

// Database types
export interface DbPost {
  id: string;
  company_domain: string | null;
  anonymous_id: string;
  content: string;
  like_count: number;
  created_at: string;
}

export interface DbComment {
  id: string;
  post_id: string;
  company_domain: string | null;
  anonymous_id: string;
  content: string;
  like_count: number;
  created_at: string;
}

export interface DbLike {
  id: string;
  target_type: 'post' | 'comment';
  target_id: string;
  company_domain: string | null;
  anonymous_id: string;
  created_at: string;
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

//export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Convert database types to app types
function dbPostToPost(dbPost: DbPost, commentCount: number = 0): import('@/lib/types').Post {
  return {
    id: dbPost.id,
    authorId: dbPost.anonymous_id,
    authorEmail: '', // Not stored for privacy
    authorAnonymousId: dbPost.anonymous_id,
    companyDomain: dbPost.company_domain || 'unknown.com',
    content: dbPost.content,
    likeCount: dbPost.like_count,
    commentCount,
    createdAt: new Date(dbPost.created_at).getTime(),
  };
}

function dbCommentToComment(dbComment: DbComment): import('@/lib/types').Comment {
  return {
    id: dbComment.id,
    postId: dbComment.post_id,
    authorId: dbComment.anonymous_id,
    authorEmail: '', // Not stored for privacy
    authorAnonymousId: dbComment.anonymous_id,
    content: dbComment.content,
    likeCount: dbComment.like_count,
    createdAt: new Date(dbComment.created_at).getTime(),
  };
}

// Custom hooks for data fetching
export function usePosts(sort: 'new' | 'hot' = 'new') {
  const [posts, setPosts] = useState<import('@/lib/types').Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch posts with comment counts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .order(sort === 'new' ? 'created_at' : 'like_count', { ascending: false })
        .limit(50);

      if (postsError) throw postsError;

      // Get comment counts for each post
      const postIds = postsData?.map(p => p.id) || [];
      const { data: commentCounts, error: countError } = await supabase
        .from('comments')
        .select('post_id')
        .in('post_id', postIds);

      if (countError) throw countError;

      // Count comments per post
      const commentCountMap = (commentCounts || []).reduce((acc, comment) => {
        acc[comment.post_id] = (acc[comment.post_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const processedPosts = (postsData || []).map(post => 
        dbPostToPost(post, commentCountMap[post.id] || 0)
      );

      setPosts(processedPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, [sort]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, error, refetch: fetchPosts };
}

export function useCompanyPosts(companyDomain: string, sort: 'new' | 'hot' = 'new') {
  const [posts, setPosts] = useState<import('@/lib/types').Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch posts for specific company with comment counts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .eq('company_domain', companyDomain)
        .order(sort === 'new' ? 'created_at' : 'like_count', { ascending: false })
        .limit(50);

      if (postsError) throw postsError;

      // Get comment counts for each post
      const postIds = postsData?.map(p => p.id) || [];
      const { data: commentCounts, error: countError } = await supabase
        .from('comments')
        .select('post_id')
        .in('post_id', postIds);

      if (countError) throw countError;

      // Count comments per post
      const commentCountMap = (commentCounts || []).reduce((acc, comment) => {
        acc[comment.post_id] = (acc[comment.post_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const processedPosts = (postsData || []).map(post => 
        dbPostToPost(post, commentCountMap[post.id] || 0)
      );

      setPosts(processedPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch company posts');
    } finally {
      setLoading(false);
    }
  }, [companyDomain, sort]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, error, refetch: fetchPosts };
}

export function useComments(postId: string) {
  const [comments, setComments] = useState<import('@/lib/types').Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;

      const processedComments = (data || []).map(dbCommentToComment);
      setComments(processedComments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return { comments, loading, error, refetch: fetchComments };
}

// Mutation functions
export async function createPost(content: string, anonymousId: string, companyDomain: string | null) {
  const { data, error } = await supabase
    .from('posts')
    .insert([
      {
        content: content.trim(),
        anonymous_id: anonymousId,
        company_domain: companyDomain,
        like_count: 0,
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createComment(postId: string, content: string, anonymousId: string, companyDomain: string | null) {
  const { data, error } = await supabase
    .from('comments')
    .insert([
      {
        post_id: postId,
        content: content.trim(),
        anonymous_id: anonymousId,
        company_domain: companyDomain,
        like_count: 0,
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function likePost(postId: string, anonymousId: string, companyDomain: string | null) {
  // Check if already liked
  const { data: existingLike } = await supabase
    .from('likes')
    .select('id')
    .eq('target_type', 'post')
    .eq('target_id', postId)
    .eq('anonymous_id', anonymousId)
    .single();

  if (existingLike) {
    // Unlike: remove like and decrement count
    await supabase
      .from('likes')
      .delete()
      .eq('id', existingLike.id);

    await supabase.rpc('decrement_like_count', {
      table_name: 'posts',
      row_id: postId
    });
  } else {
    // Like: add like and increment count
    await supabase
      .from('likes')
      .insert([
        {
          target_type: 'post',
          target_id: postId,
          anonymous_id: anonymousId,
          company_domain: companyDomain,
        }
      ]);

    await supabase.rpc('increment_like_count', {
      table_name: 'posts',
      row_id: postId
    });
  }
}

export async function likeComment(commentId: string, anonymousId: string, companyDomain: string | null) {
  // Check if already liked
  const { data: existingLike } = await supabase
    .from('likes')
    .select('id')
    .eq('target_type', 'comment')
    .eq('target_id', commentId)
    .eq('anonymous_id', anonymousId)
    .single();

  if (existingLike) {
    // Unlike: remove like and decrement count
    await supabase
      .from('likes')
      .delete()
      .eq('id', existingLike.id);

    await supabase.rpc('decrement_like_count', {
      table_name: 'comments',
      row_id: commentId
    });
  } else {
    // Like: add like and increment count
    await supabase
      .from('likes')
      .insert([
        {
          target_type: 'comment',
          target_id: commentId,
          anonymous_id: anonymousId,
          company_domain: companyDomain,
        }
      ]);

    await supabase.rpc('increment_like_count', {
      table_name: 'comments',
      row_id: commentId
    });
  }
}
