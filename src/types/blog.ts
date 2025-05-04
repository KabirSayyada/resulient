
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image: string | null;
  author_id: string;
  category: string | null;
  tags: string[];
  published_at: string | null;
  created_at: string;
  updated_at: string;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  author_first_name?: string | null;
  author_last_name?: string | null;
  author_avatar_url?: string | null;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}
