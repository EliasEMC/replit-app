import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { PropertyForm } from '@/components/properties/PropertyForm';
import { useAuth } from '@/hooks/useAuth';
import { PropertyFormData } from '@/types/property';

export default function NewProperty() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { token } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: PropertyFormData, images: File[]) => {
    try {
      setError(null);
      const formDataToSend = new FormData();
      
      // Append form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined) {
          formDataToSend.append(key, value.toString());
        }
      });

      // Append images
      images.forEach((image) => {
        formDataToSend.append('images', image);
      });

      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear la propiedad');
      }

      // Redirigir a la página de propiedades
      setLocation('/admin/properties');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la propiedad');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <PropertyForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
} 