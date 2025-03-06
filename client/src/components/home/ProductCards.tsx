import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const products = [
  {
    id: "properties",
    title: "products.properties",
    image: "https://images.unsplash.com/photo-1460317442991-0ec209397118"
  },
  {
    id: "industrial",
    title: "products.industrial",
    image: "https://images.unsplash.com/photo-1513828583688-c52646f9b5d9"
  },
  {
    id: "residential",
    title: "products.residential",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914"
  },
  {
    id: "prefab",
    title: "products.prefab",
    image: "https://images.unsplash.com/photo-1590274853856-f5e3626dbb40"
  }
];

export default function ProductCards() {
  const { t } = useTranslation();

  return (
    <div id="products" className="py-24 bg-gray-50 dark:bg-gray-900 border-t border-border">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{t("products.properties")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                <div
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${product.image})` }}
                />
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold">{t(product.title)}</h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}