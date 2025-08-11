export type CompanyDomain = string; // e.g., "acme.com"

export interface User {
  id: string;
  displayName: string;
  anonymousId: string; // Random 6-char alphanumeric ID for anonymous posting
  email: string;
  companyDomain: CompanyDomain | null;
}

export interface Post {
  id: string;
  authorId: string;
  authorEmail: string;
  authorAnonymousId: string; // Anonymous display name
  companyDomain: CompanyDomain;
  content: string;
  likeCount: number;
  commentCount: number;
  createdAt: number; // epoch ms
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorEmail: string;
  authorAnonymousId: string; // Anonymous display name
  content: string;
  likeCount: number;
  createdAt: number; // epoch ms
}

export interface GoogleJwtPayload {
  email: string;
  kid: string;
}
