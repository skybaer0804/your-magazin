export interface User {
  id: string;
  _id?: string;
  email: string;
  name: string;
  image?: string;
  bio?: string;
  role: 'user' | 'admin';
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Menu {
  _id?: string;
  title: string;
  order: number;
}

export interface SiteConfig {
  siteTitle: string;
  logoText: string;
  menus: Menu[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Magazine {
  _id: string;
  title: string;
  description?: string;
  content: string;
  coverImage?: string | null;
  category: 'lifestyle' | 'tech' | 'travel' | 'food' | 'fashion' | 'other';
  tags: string[];
  author: User | string;
  viewCount: number;
  likes: number;
  likedBy: string[];
  status: 'draft' | 'published';
  menuId?: string | null;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
