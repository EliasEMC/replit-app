import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PropertyFilters,
  PropertyType,
  ListingType,
  mexicanStates,
  industrialSubtypes,
  residentialSubtypes
} from "@/lib/types/property";

interface PropertyFiltersProps {
  propertyType: PropertyType;
  onFilterChange: (filters: PropertyFilters) => void;
}

export default function PropertyFiltersComponent({ propertyType, onFilterChange }: PropertyFiltersProps) {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<PropertyFilters>({
    type: propertyType,
    listingType: 'sale',
    location: '',
    propertySubtype: '',
    priceRange: { min: 0, max: 999999999 },
    surfaceRange: { min: 0, max: 999999 }
  });

  const handleChange = (field: keyof PropertyFilters, value: any) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const subtypes = propertyType === 'industrial' ? industrialSubtypes : residentialSubtypes;

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{t('filters.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>{t('filters.listingType')}</Label>
            <Select
              value={filters.listingType}
              onValueChange={(value) => handleChange('listingType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('filters.selectListingType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">{t('filters.sale')}</SelectItem>
                <SelectItem value="rent">{t('filters.rent')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t('filters.location')}</Label>
            <Select
              value={filters.location}
              onValueChange={(value) => handleChange('location', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('filters.selectState')} />
              </SelectTrigger>
              <SelectContent>
                {mexicanStates.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t('filters.propertyType')}</Label>
            <Select
              value={filters.propertySubtype}
              onValueChange={(value) => handleChange('propertySubtype', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('filters.selectPropertyType')} />
              </SelectTrigger>
              <SelectContent>
                {subtypes.map((subtype) => (
                  <SelectItem key={subtype} value={subtype}>
                    {t(`propertyTypes.${subtype}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t('filters.minPrice')}</Label>
            <Input
              type="number"
              value={filters.priceRange.min}
              onChange={(e) => handleChange('priceRange', { ...filters.priceRange, min: Number(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <Label>{t('filters.maxPrice')}</Label>
            <Input
              type="number"
              value={filters.priceRange.max}
              onChange={(e) => handleChange('priceRange', { ...filters.priceRange, max: Number(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <Label>{t('filters.surface')} (m²)</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.surfaceRange.min}
                onChange={(e) => handleChange('surfaceRange', { ...filters.surfaceRange, min: Number(e.target.value) })}
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.surfaceRange.max}
                onChange={(e) => handleChange('surfaceRange', { ...filters.surfaceRange, max: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
