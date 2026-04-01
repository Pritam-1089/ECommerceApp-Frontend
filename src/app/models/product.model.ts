export interface Product {
  id: number;
  name: string;
  description: string;
  sku: string;
  price: number;
  discountPrice: number | null;
  stockQuantity: number;
  imageUrl: string;
  categoryId: number;
  categoryName: string;
  averageRating: number;
  reviewCount: number;
}

export interface CreateProduct {
  name: string;
  description: string;
  sku: string;
  price: number;
  discountPrice: number | null;
  stockQuantity: number;
  imageUrl: string;
  categoryId: number;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  parentCategoryId: number | null;
  subCategories: Category[];
}
