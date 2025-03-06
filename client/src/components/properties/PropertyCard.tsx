import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Property } from "@/lib/types/property";
import { formatCurrency } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div
        className="h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${property.images[0]})` }}
      />
      <CardHeader>
        <CardTitle className="text-xl">{property.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{property.location}</p>
          <p className="text-lg font-semibold">{formatCurrency(property.price)}</p>
          <div className="flex justify-between text-sm">
            <span>{t(`propertyTypes.${property.propertySubtype}`)}</span>
            <span>{property.surface} m²</span>
          </div>
          <p className="text-sm line-clamp-2">{property.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
