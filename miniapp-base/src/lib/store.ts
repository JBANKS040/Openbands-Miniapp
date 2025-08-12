"use client";
import { create } from 'zustand';
import { ulid } from 'ulid';
import type { Comment, CompanyDomain, Post, User } from './types';

function now() {
  return Date.now();
}

interface AppState {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  
  // Data
  posts: Post[];
  comments: Comment[];
  
  // UI state
  sort: 'new' | 'top';
  version: number; // for triggering re-renders
  
  // Actions
  signIn: (email: string, idToken: string) => void;
  signOut: () => void;
  createPost: (content: string) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  createComment: (postId: string, content: string) => Promise<void>;
  likeComment: (commentId: string) => Promise<void>;
  setSort: (mode: 'new' | 'top') => void;
  getPostsByDomain: (domain: CompanyDomain, sort: 'new' | 'top') => Post[];
  getAllPosts: (sort: 'new' | 'top') => Post[];
  getCommentsByPost: (postId: string) => Comment[];
}

// Start with empty state - no sample data

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  posts: [],
  comments: [],
  sort: 'new',
  version: 0,

  // Auth actions
        signIn: (email: string, idToken: string) => {
    const domain = email.split('@')[1] || 'example.com';
    // Generate random 6-character alphanumeric anonymous ID
    const anonymousId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const user: User = {
      id: ulid(),
      displayName: email.split('@')[0],
      anonymousId,
      email,
      companyDomain: domain,
    };
    set({ user, isAuthenticated: true });
  },

  signOut: () => {
    set({ user: null, isAuthenticated: false });
  },

  // Post actions
        createPost: async (content: string) => {
        const { user } = get();
    if (!user || !user.companyDomain) return;

    const post: Post = {
      id: ulid(),
      authorId: user.id,
      authorEmail: user.email,
      authorAnonymousId: user.anonymousId,
      companyDomain: user.companyDomain,
      content,
      likeCount: 0,
      commentCount: 0,
      createdAt: now(),
    };

    set((state) => ({
      posts: [post, ...state.posts],
      version: state.version + 1,
    }));
  },

  likePost: async (postId: string) => {
    set((state) => ({
      posts: state.posts.map(p => 
        p.id === postId ? { ...p, likeCount: p.likeCount + 1 } : p
      ),
      version: state.version + 1,
    }));
  },

  createComment: async (postId: string, content: string) => {
    const { user } = get();
    if (!user) return;

    const comment: Comment = {
      id: ulid(),
      postId,
      authorId: user.id,
      authorEmail: user.email,
      authorAnonymousId: user.anonymousId,
      content,
      likeCount: 0,
      createdAt: now(),
    };

    set((state) => ({
      comments: [...state.comments, comment],
      posts: state.posts.map(p => 
        p.id === postId ? { ...p, commentCount: p.commentCount + 1 } : p
      ),
      version: state.version + 1,
    }));
  },

  likeComment: async (commentId: string) => {
    set((state) => ({
      comments: state.comments.map(c => 
        c.id === commentId ? { ...c, likeCount: c.likeCount + 1 } : c
      ),
      version: state.version + 1,
    }));
  },

  // UI actions
  setSort: (mode) => {
    set({ sort: mode });
  },

  // Data getters - using callback pattern to avoid re-creation
  getPostsByDomain: (domain: CompanyDomain, sort: 'new' | 'top') => {
    const { posts } = get();
    const filtered = posts.filter(p => p.companyDomain === domain);
    if (sort === 'new') {
      return [...filtered].sort((a, b) => b.createdAt - a.createdAt);
    }
    return [...filtered].sort((a, b) => b.likeCount - a.likeCount || b.createdAt - a.createdAt);
  },

  getAllPosts: (sort: 'new' | 'top') => {
    const { posts } = get();
    if (sort === 'new') {
      return [...posts].sort((a, b) => b.createdAt - a.createdAt);
    }
    return [...posts].sort((a, b) => b.likeCount - a.likeCount || b.createdAt - a.createdAt);
  },

  getCommentsByPost: (postId: string) => {
    const { comments } = get();
    return comments
      .filter(c => c.postId === postId)
      .sort((a, b) => a.createdAt - b.createdAt);
  },
}));
