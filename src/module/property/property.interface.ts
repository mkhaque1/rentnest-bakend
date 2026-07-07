export interface ICreatePropertyPayload {
  title: string;
  description: string;
  location: string;
  price: number;
  type: string;
  amenities?: string[];
  categoryId: string;
}

export interface IUpdatePropertyPayload {
  title?: string;
  description?: string;
  location?: string;
  price?: number;
  type?: string;
  amenities?: string[];
  categoryId?: string;
  status?: 'AVAILABLE' | 'UNAVAILABLE';
}

export interface IPropertyFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  type?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}
