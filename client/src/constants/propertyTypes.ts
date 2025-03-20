interface PropertyType {
  value: string;
  label: string;
}

interface PropertyTypes {
  [key: string]: PropertyType[];
}

export const propertyTypes: PropertyTypes = {
  industrial: [
    { value: 'warehouse', label: 'Nave Industrial' },
    { value: 'factory', label: 'Fábrica' },
    { value: 'logistics', label: 'Centro Logístico' },
    { value: 'industrial_park', label: 'Parque Industrial' }
  ],
  commercial: [
    { value: 'office', label: 'Oficina' },
    { value: 'retail', label: 'Local Comercial' },
    { value: 'shopping_center', label: 'Centro Comercial' },
    { value: 'warehouse', label: 'Almacén' }
  ],
  residential: [
    { value: 'house', label: 'Casa' },
    { value: 'apartment', label: 'Departamento' },
    { value: 'land', label: 'Terreno' },
    { value: 'penthouse', label: 'Penthouse' }
  ]
}; 