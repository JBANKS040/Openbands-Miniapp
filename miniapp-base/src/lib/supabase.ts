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
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create supabase client only if environment variables are available and valid
export const supabase = (supabaseUrl && supabaseUrl.trim() && supabaseAnonKey && supabaseAnonKey.trim())
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper function to check if supabase is configured
function isSupabaseConfigured(): boolean {
  return supabase !== null;
}

// Helper function to get supabase client with error handling
function getSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please check your environment variables.');
  }
  return supabase;
}

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

  const fetchPosts = useCallback(async (opts?: { silent?: boolean }) => {
    try {
      const silent = Boolean(opts?.silent);
      if (!silent) setLoading(true);
      setError(null);

      // Check if Supabase is configured
      if (!isSupabaseConfigured() || !supabase) {
        setPosts([]);
        setError(null);
        if (!silent) setLoading(false);
        return;
      }

      const supabaseClient = getSupabase();

      // Fetch posts with comment counts
      const { data: postsData, error: postsError } = await supabaseClient
        .from('posts')
        .select('*')
        .order(sort === 'new' ? 'created_at' : 'like_count', { ascending: false })
        .limit(50);

      if (postsError) throw postsError;

      // Get comment counts for each post
      const postIds = postsData?.map(p => p.id) || [];
      const { data: commentCounts, error: countError } = await supabaseClient
        .from('comments')
        .select('post_id')
        .in('post_id', postIds);

      if (countError) throw countError;

      // Count comments per post
      const commentCountMap = (commentCounts || []).reduce((acc, comment) => {
        acc[comment.post_id] = (acc[comment.post_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Get like counts for each post (derive from likes table so we don't depend on RPC)
      const { data: likeRows, error: likesError } = await supabaseClient
        .from('likes')
        .select('target_id')
        .eq('target_type', 'post')
        .in('target_id', postIds);

      if (likesError) throw likesError;

      const likeCountMap = (likeRows || []).reduce((acc, row) => {
        acc[row.target_id] = (acc[row.target_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const processedPosts = (postsData || []).map(post => {
        const mapped = dbPostToPost(post, commentCountMap[post.id] || 0);
        mapped.likeCount = likeCountMap[post.id] || 0;
        return mapped;
      });

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

  const fetchPosts = useCallback(async (opts?: { silent?: boolean }) => {
    try {
      const silent = Boolean(opts?.silent);
      if (!silent) setLoading(true);
      setError(null);

      // Check if Supabase is configured
      if (!isSupabaseConfigured()) {
        setPosts([]);
        setError(null);
        if (!silent) setLoading(false);
        return;
      }

      const supabaseClient = getSupabase();

      // Fetch posts for specific company with comment counts
      const { data: postsData, error: postsError } = await supabaseClient
        .from('posts')
        .select('*')
        .eq('company_domain', companyDomain)
        .order(sort === 'new' ? 'created_at' : 'like_count', { ascending: false })
        .limit(50);

      if (postsError) throw postsError;

      // Get comment counts for each post
      const postIds = postsData?.map(p => p.id) || [];
      const { data: commentCounts, error: countError } = await supabaseClient
        .from('comments')
        .select('post_id')
        .in('post_id', postIds);

      if (countError) throw countError;

      // Count comments per post
      const commentCountMap = (commentCounts || []).reduce((acc, comment) => {
        acc[comment.post_id] = (acc[comment.post_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Derive like counts from likes table
      const { data: likeRows, error: likesError } = await supabaseClient
        .from('likes')
        .select('target_id')
        .eq('target_type', 'post')
        .in('target_id', postIds);

      if (likesError) throw likesError;

      const likeCountMap = (likeRows || []).reduce((acc, row) => {
        acc[row.target_id] = (acc[row.target_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const processedPosts = (postsData || []).map(post => {
        const mapped = dbPostToPost(post, commentCountMap[post.id] || 0);
        mapped.likeCount = likeCountMap[post.id] || 0;
        return mapped;
      });

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

  const fetchComments = useCallback(async (opts?: { silent?: boolean }) => {
    try {
      const silent = Boolean(opts?.silent);
      if (!silent) setLoading(true);
      setError(null);

      // Check if Supabase is configured
      if (!isSupabaseConfigured()) {
        setComments([]);
        setError(null);
        if (!silent) setLoading(false);
        return;
      }

      const supabaseClient = getSupabase();

      const { data, error: commentsError } = await supabaseClient
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;

      // Derive like counts for comments
      const commentIds = (data || []).map(c => c.id);
      let likeCountMap: Record<string, number> = {};
      if (commentIds.length > 0) {
        const { data: likeRows, error: likesError } = await supabaseClient
          .from('likes')
          .select('target_id')
          .eq('target_type', 'comment')
          .in('target_id', commentIds);
        if (likesError) throw likesError;
        likeCountMap = (likeRows || []).reduce((acc, row) => {
          acc[row.target_id] = (acc[row.target_id] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
      }

      const processedComments = (data || []).map(dbCommentToComment).map(c => ({
        ...c,
        likeCount: likeCountMap[c.id] || 0,
      }));
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
  const supabaseClient = getSupabase();
  
  const { data, error } = await supabaseClient
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
  const supabaseClient = getSupabase();
  
  const { data, error } = await supabaseClient
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
  const supabaseClient = getSupabase();
  
  // Check if already liked
  const { data: existingLike } = await supabaseClient
    .from('likes')
    .select('id')
    .eq('target_type', 'post')
    .eq('target_id', postId)
    .eq('anonymous_id', anonymousId)
    .maybeSingle();

  if (existingLike) {
    await supabaseClient
      .from('likes')
      .delete()
      .eq('id', existingLike.id);
  } else {
    await supabaseClient
      .from('likes')
      .insert([
        {
          target_type: 'post',
          target_id: postId,
          anonymous_id: anonymousId,
          company_domain: companyDomain,
        }
      ]);
  }
}

export async function likeComment(commentId: string, anonymousId: string, companyDomain: string | null) {
  const supabaseClient = getSupabase();
  
  // Check if already liked
  const { data: existingLike } = await supabaseClient
    .from('likes')
    .select('id')
    .eq('target_type', 'comment')
    .eq('target_id', commentId)
    .eq('anonymous_id', anonymousId)
    .maybeSingle();

  if (existingLike) {
    await supabaseClient
      .from('likes')
      .delete()
      .eq('id', existingLike.id);
  } else {
    await supabaseClient
      .from('likes')
      .insert([
        {
          target_type: 'comment',
          target_id: commentId,
          anonymous_id: anonymousId,
          company_domain: companyDomain,
        }
      ]);
  }
}
