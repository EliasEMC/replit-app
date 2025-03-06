import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useState } from "react";

const products = [
  {
    id: "industrial",
    title: "products.industrial",
    image: "https://images.unsplash.com/photo-1513828583688-c52646f9b5d9",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    features: ["High-quality construction", "Strategic locations", "Modern facilities"]
  },
  {
    id: "residential",
    title: "products.residential",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
    description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    features: ["Premium finishes", "Excellent location", "Smart home features"]
  },
  {
    id: "prefab",
    title: "products.prefab",
    image: "https://images.unsplash.com/photo-1590274853856-f5e3626dbb40",
    description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    features: ["Quick assembly", "Cost-effective", "Customizable designs"]
  }
];

export default function ProductInfo() {
  const { t } = useTranslation();
  const [currentProduct, setCurrentProduct] = useState(0);

  const nextProduct = () => {
    setCurrentProduct((prev) => (prev + 1) % products.length);
  };

  const prevProduct = () => {
    setCurrentProduct((prev) => (prev - 1 + products.length) % products.length);
  };

  const product = products[currentProduct];

  return (
    <div id="industrial" className="py-20 bg-background border-t border-b border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={product.image}
              alt={t(product.title)}
              className="rounded-lg shadow-lg object-cover h-[400px] w-full"
            />
          </motion.div>

          <motion.div
            key={`${product.id}-info`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6">{t(product.title)}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              {product.description}
            </p>
            <ul className="space-y-4 mb-8">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="flex gap-4">
              <button
                onClick={prevProduct}
                className="px-4 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-white transition"
              >
                Previous
              </button>
              <button
                onClick={nextProduct}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
              >
                Next
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}