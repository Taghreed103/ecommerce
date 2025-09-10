export interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubcategoryResponse {
  results: number;
  data: Subcategory[];
}
