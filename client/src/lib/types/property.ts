export type PropertyType = 'industrial' | 'residential';
export type ListingType = 'sale' | 'rent';

export interface PropertyFilters {
  type: PropertyType;
  listingType: ListingType;
  location: string;
  propertySubtype: string;
  priceRange: {
    min: number;
    max: number;
  };
  surfaceRange: {
    min: number;
    max: number;
  };
}

export interface Property {
  id: string;
  type: PropertyType;
  listingType: ListingType;
  title: string;
  description: string;
  location: string;
  state: string;
  propertySubtype: string;
  price: number;
  surface: number;
  images: string[];
}

export const industrialSubtypes = [
  'building',
  'warehouse',
  'lot',
  'macrolot',
  'retail',
  'office',
  'modular'
];

export const residentialSubtypes = [
  'land',
  'lot',
  'house',
  'apartment',
  'prefab'
];

export const mexicanStates = [
  'Aguascalientes',
  'Baja California',
  'Baja California Sur',
  'Campeche',
  'Chiapas',
  'Chihuahua',
  'Coahuila',
  'Colima',
  'Durango',
  'Guanajuato',
  'Guerrero',
  'Hidalgo',
  'Jalisco',
  'México',
  'Michoacán',
  'Morelos',
  'Nayarit',
  'Nuevo León',
  'Oaxaca',
  'Puebla',
  'Querétaro',
  'Quintana Roo',
  'San Luis Potosí',
  'Sinaloa',
  'Sonora',
  'Tabasco',
  'Tamaulipas',
  'Tlaxcala',
  'Veracruz',
  'Yucatán',
  'Zacatecas'
];
