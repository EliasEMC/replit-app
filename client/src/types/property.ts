export interface PropertyImage {
  id: number;
  url: string;
  is_main: boolean;
}

export interface PropertyFormData {
  type: 'industrial' | 'commercial' | 'residential';
  listing_type: 'sale' | 'rent';
  name: string;
  location: string;
  property_type: string;
  price: number;
  surface: number;
  construction?: number;
  description: string;
  technical_sheet?: string;
  latitude: number;
  longitude: number;
  status: 'active' | 'inactive' | 'sold' | 'rented';
  images?: PropertyImage[];
} 