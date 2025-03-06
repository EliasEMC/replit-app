import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSlider from "@/components/home/HeroSlider";
import ProductCards from "@/components/home/ProductCards";
import ProductInfo from "@/components/home/ProductInfo";
import ContactForm from "@/components/home/ContactForm";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      id="top"
    >
      <Header />
      <Navbar />
      <main>
        <HeroSlider />
        <ProductCards />
        <ProductInfo />
        <ContactForm />
      </main>
      <Footer />
    </motion.div>
  );
}
