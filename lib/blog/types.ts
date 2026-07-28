export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  body: string | null;
  published: boolean;
  published_at: string;
};
