import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import PropertyMap from '../maps/PropertyMap';
import { useAuth } from '@/hooks/useAuth';
import { propertyTypes } from '../../constants/propertyTypes';
import { PropertyFormData, PropertyImage } from '../../types/property';

interface PropertyFormProps {
  id?: string;
  onSubmit?: (formData: PropertyFormData, images: File[]) => Promise<void>;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({ id, onSubmit }) => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<PropertyFormData>({
    type: 'industrial',
    listing_type: 'sale',
    name: '',
    location: '',
    property_type: '',
    price: 0,
    surface: 0,
    construction: 0,
    description: '',
    technical_sheet: '',
    latitude: 19.4326,
    longitude: -99.1332,
    status: 'active',
    images: []
  });

  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      const fetchProperty = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/properties/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            throw new Error('Error al cargar la propiedad');
          }

          const data = await response.json();
          setFormData(data);
          setSelectedLocation({
            lat: data.latitude,
            lng: data.longitude
          });
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Error al cargar la propiedad');
        } finally {
          setLoading(false);
        }
      };

      fetchProperty();
    }
  }, [id, token]);

  useEffect(() => {
    if (formData.images) {
      setPreviewUrls(formData.images.map(img => img.url));
    }
  }, [formData.images]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setImages(prev => [...prev, ...newFiles]);
      
      // Create preview URLs
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      const newUrls = [...prev];
      URL.revokeObjectURL(newUrls[index]);
      return newUrls.filter((_, i) => i !== index);
    });
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
  };

  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, location: e.target.value }));
  };

  const validateForm = (): string | null => {
    // Validar tipo de operación
    if (!formData.listing_type) {
      return 'Debes seleccionar un tipo de operación (Venta/Renta)';
    }

    // Validar categoría de propiedad
    if (!formData.type) {
      return 'Debes seleccionar una categoría de propiedad';
    }

    // Validar nombre
    if (!formData.name.trim()) {
      return 'El nombre de la propiedad es requerido';
    }

    // Validar dirección
    if (!formData.location.trim()) {
      return 'La dirección es requerida';
    }

    // Validar tipo de propiedad
    if (!formData.property_type) {
      return 'Debes seleccionar un tipo de propiedad';
    }

    // Validar precio
    if (formData.price <= 0) {
      return 'El precio debe ser mayor a 0';
    }

    // Validar superficie
    if (formData.surface <= 0) {
      return 'La superficie total debe ser mayor a 0';
    }

    // Validar área construida solo si está definida
    if (formData.construction !== undefined && formData.construction <= 0) {
      return 'El área construida debe ser mayor a 0';
    }

    // Validar descripción
    if (!formData.description.trim()) {
      return 'La descripción general es requerida';
    }

    // Validar ficha técnica para propiedades industriales
    if (formData.type === 'industrial' && !formData.technical_sheet?.trim()) {
      return 'La ficha técnica es requerida para propiedades industriales';
    }

    // Validar ubicación en el mapa
    if (!selectedLocation) {
      return 'Debes seleccionar una ubicación en el mapa';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar todos los campos
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (onSubmit) {
        // Si se proporciona onSubmit, usarlo
        await onSubmit(formData, images);
      } else {
        // Lógica original
        const url = id ? `/api/properties/${id}` : '/api/properties';
        const method = id ? 'PUT' : 'POST';

        const formDataToSend = new FormData();
        
        Object.entries(formData).forEach(([key, value]) => {
          formDataToSend.append(key, value?.toString() ?? '');
        });

        images.forEach((image) => {
          formDataToSend.append('images', image);
        });

        const response = await fetch(url, {
          method,
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataToSend
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al guardar la propiedad');
        }
      }

      setLocation('/admin/properties');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la propiedad');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-gray-600">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          {id ? 'Editar Propiedad' : 'Nuevas Propiedad'}
        </h1>
        <button
          onClick={handleSubmit}
          disabled={loading || !selectedLocation}
          className={`px-4 py-2 rounded-md text-white ${
            loading || !selectedLocation
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Guardando...' : 'Guardar Propiedad'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna izquierda */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo de Operación
              </label>
              <select
                name="listing_type"
                value={formData.listing_type}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="sale">Venta</option>
                <option value="rent">Renta</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Categoría
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="industrial">Industrial</option>
                <option value="commercial">Comercial</option>
                <option value="residential">Residencial</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo de Propiedad
              </label>
              <select
                name="property_type"
                value={formData.property_type}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Seleccione un tipo</option>
                {propertyTypes[formData.type].map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre de la Propiedad
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Ej: Nave Industrial Moderna"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Dirección
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleLocationInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Ej: Av. Industrial 123"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Precio (MXN)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Superficie Total (m²)
              </label>
              <input
                type="number"
                name="surface"
                value={formData.surface}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Superficie Construida (m²)
              </label>
              <input
                type="number"
                name="construction"
                value={formData.construction}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Estado
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="sold">Vendido</option>
                <option value="rented">Rentado</option>
              </select>
            </div>

            {formData.type === 'industrial' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ficha Técnicaaaa
                </label>
                <textarea
                  name="technical_sheet"
                  value={formData.technical_sheet}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Detalles técnicos de la propiedad..."
                />
              </div>
            )}
          </div>

          {/* Columna derecha */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ubicación en el Mapa
              </label>
              <div className="h-96 rounded-lg overflow-hidden">
                <PropertyMap 
                  onLocationSelect={handleLocationSelect}
                  initialLocation={selectedLocation}
                />
              </div>
              {selectedLocation && (
                <p className="mt-2 text-sm text-gray-500">
                  Coordenadas: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descripción General
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Describa la propiedad..."
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Imágenes de la Propiedad
              </label>
              <div className="bg-white p-4 border border-gray-300 rounded-md">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Seleccione una o más imágenes para la propiedad
                </p>
              </div>
              {previewUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}; 