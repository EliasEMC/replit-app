import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PropertyMap from "@/components/maps/PropertyMap";
import PropertyFilters from "@/components/properties/PropertyFilters";
import PropertyCard from "@/components/properties/PropertyCard";
import { sampleProperties } from "@/lib/data/properties";
import type { Property, PropertyFilters as PropertyFiltersType } from "@/lib/types/property";

export default function Industrial() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<PropertyFiltersType>({
    type: 'industrial',
    listingType: 'sale',
    location: '',
    propertySubtype: '',
    priceRange: { min: 0, max: 999999999 },
    surfaceRange: { min: 0, max: 999999 }
  });

  const filteredProperties = useMemo(() => {
    return sampleProperties.filter(property => {
      if (property.type !== 'industrial') return false;
      if (filters.listingType && property.listingType !== filters.listingType) return false;
      if (filters.location && property.state !== filters.location) return false;
      if (filters.propertySubtype && property.propertySubtype !== filters.propertySubtype) return false;
      if (property.price < filters.priceRange.min || property.price > filters.priceRange.max) return false;
      if (property.surface < filters.surfaceRange.min || property.surface > filters.surfaceRange.max) return false;
      return true;
    });
  }, [filters]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
    >
      <Header />
      <Navbar />

      <main>
        {/* Hero Section */}
        <div className="relative h-[400px] bg-slate-900">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url(https://images.unsplash.com/photo-1513828583688-c52646f9b5d9)",
              filter: "brightness(0.4)"
            }}
          />
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {t("nav.industrial")}
              </h1>
              <p className="text-xl text-white/90">
                Soluciones inmobiliarias para su negocio
              </p>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Nuestras Ubicaciones</h2>
            <PropertyMap />
          </div>
        </div>

        {/* Properties Section */}
        <div className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Propiedades Industriales</h2>

            <PropertyFilters
              propertyType="industrial"
              onFilterChange={setFilters}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {filteredProperties.length === 0 && (
              <div className="text-center py-8">
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  No se encontraron propiedades con los filtros seleccionados.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </motion.div>
  );
}