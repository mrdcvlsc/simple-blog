export type BlogListItem = {
  id: number;
  title: string;
  created_at: string;
  owner_email: string | null;
}

export type BlogList = BlogListItem[];

