export type BlogListItem = {
  id: number;
  title: string;
  created_at: string;
  owner_email: string | null;
}

export type BlogListItemWithoutOwnerEmail = {
  id: number;
  title: string;
  created_at: string;
}

export type BlogList = BlogListItem[];
export type BlogListWithoutOwnerEmail = BlogListItemWithoutOwnerEmail[];

