import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PropertyMap from "@/components/maps/PropertyMap";
import { Button } from "@/components/ui/button";

const industrialFeatures = [
  {
    title: "Espacios Industriales",
    description: "Naves industriales y almacenes diseñados para maximizar la eficiencia operativa.",
    image: "https://images.unsplash.com/photo-1513828583688-c52646f9b5d9"
  },
  {
    title: "Centros Comerciales",
    description: "Espacios comerciales modernos con alta afluencia y ubicaciones estratégicas.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8"
  },
  {
    title: "Parques Industriales",
    description: "Desarrollos integrales con infraestructura de primer nivel y conectividad.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab"
  }
];

export default function Industrial() {
  const { t } = useTranslation();

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

        {/* Features Grid */}
        <div className="py-24 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {industrialFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-slate-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg"
                >
                  <div
                    className="h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url(${feature.image})` }}
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 bg-slate-100 dark:bg-gray-800">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">¿Interesado en nuestras soluciones?</h2>
            <Button
              size="lg"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Contáctenos
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </motion.div>
  );
}