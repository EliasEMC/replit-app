import { Property } from '../types/property';

export const sampleProperties: Property[] = [
  {
    id: '1',
    type: 'industrial',
    listingType: 'sale',
    title: 'Nave Industrial Moderna',
    description: 'Nave industrial con excelente ubicación y acceso a principales vías',
    location: 'Parque Industrial Querétaro',
    state: 'Querétaro',
    propertySubtype: 'warehouse',
    price: 15000000,
    surface: 2500,
    images: ['https://images.unsplash.com/photo-1513828583688-c52646f9b5d9']
  },
  {
    id: '2',
    type: 'industrial',
    listingType: 'rent',
    title: 'Edificio Corporativo',
    description: 'Edificio de oficinas en zona premium',
    location: 'Santa Fe',
    state: 'México',
    propertySubtype: 'office',
    price: 250000,
    surface: 1500,
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab']
  },
  {
    id: '3',
    type: 'residential',
    listingType: 'sale',
    title: 'Casa Residencial',
    description: 'Hermosa casa con acabados de lujo',
    location: 'San Pedro Garza García',
    state: 'Nuevo León',
    propertySubtype: 'house',
    price: 8500000,
    surface: 450,
    images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914']
  },
  {
    id: '4',
    type: 'residential',
    listingType: 'rent',
    title: 'Departamento Moderno',
    description: 'Departamento amueblado en zona exclusiva',
    location: 'Polanco',
    state: 'México',
    propertySubtype: 'apartment',
    price: 35000,
    surface: 120,
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00']
  }
];
