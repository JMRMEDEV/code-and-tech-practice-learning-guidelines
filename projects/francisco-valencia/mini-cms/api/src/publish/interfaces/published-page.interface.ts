export interface PublishedSection {
  id: string;
  type: 'text' | 'image' | 'chart';
  order: number;
  data: any;
}

export interface PublishedPage {
  title: string;
  slug: string;
  sections: PublishedSection[];
  publishedAt: Date;
}