import { z } from 'zod';

// Enums para los tipos de propiedades
export const PropertyTypes = ['industrial', 'commercial', 'residential'] as const;
export const ListingTypes = ['sale', 'rent'] as const;
export const PropertyStatus = ['active', 'inactive', 'sold', 'rented'] as const;

// Esquema base para todas las propiedades
const basePropertySchema = z.object({
  type: z.enum(PropertyTypes),
  listing_type: z.enum(ListingTypes),
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  location: z.string().min(5, 'La ubicación debe tener al menos 5 caracteres'),
  property_type: z.string().min(3, 'El tipo de propiedad debe tener al menos 3 caracteres'),
  price: z.number().positive('El precio debe ser mayor a 0'),
  surface: z.number().positive('La superficie debe ser mayor a 0'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  status: z.enum(PropertyStatus).default('active'),
  images: z.any().optional(), // Permitimos cualquier tipo para las imágenes ya que se manejan como archivos
});

// Esquema específico para propiedades industriales
export const industrialPropertySchema = basePropertySchema.extend({
  type: z.literal('industrial'),
  construction: z.number().positive('El área de construcción debe ser mayor a 0'),
  technical_sheet: z.string().min(1, 'La ficha técnica es requerida'),
});

// Esquema específico para propiedades comerciales
export const commercialPropertySchema = basePropertySchema.extend({
  type: z.literal('commercial'),
  local_size: z.string().min(1, 'El tamaño del local es requerido'),
  construction: z.number().positive('El área de construcción debe ser mayor a 0').optional(),
});

// Esquema específico para propiedades residenciales
export const residentialPropertySchema = basePropertySchema.extend({
  type: z.literal('residential'),
  construction: z.number().positive('El área de construcción debe ser mayor a 0'),
});

// Esquema unificado que valida según el tipo de propiedad
export const propertySchema = z.discriminatedUnion('type', [
  industrialPropertySchema,
  commercialPropertySchema,
  residentialPropertySchema,
]);

// Tipo inferido del esquema
export type PropertyFormData = z.infer<typeof propertySchema>; 