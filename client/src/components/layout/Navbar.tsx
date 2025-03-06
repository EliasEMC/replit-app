import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Navbar() {
  const { t } = useTranslation();

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Button
            variant="ghost"
            onClick={() => scrollToSection("top")}
          >
            {t("nav.home")}
          </Button>

          <div className="flex gap-4">
            <Button
              variant="ghost"
              onClick={() => scrollToSection("products")}
            >
              {t("nav.properties")}
            </Button>
            <Button
              variant="ghost"
              onClick={() => scrollToSection("industrial")}
            >
              {t("nav.industrial")}
            </Button>
            <Button
              variant="ghost"
              onClick={() => scrollToSection("contact")}
            >
              {t("nav.contact")}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
