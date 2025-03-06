import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

export default function Navbar() {
  const { t } = useTranslation();
  const [location] = useLocation();

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <Button
              variant="ghost"
              className="cursor-pointer"
            >
              {t("nav.home")}
            </Button>
          </Link>

          <div className="flex gap-4">
            {location === "/" ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => scrollToSection("products")}
                >
                  {t("nav.properties")}
                </Button>
                <Link href="/industrial">
                  <Button
                    variant="ghost"
                    className="cursor-pointer"
                  >
                    {t("nav.industrial")}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => scrollToSection("contact")}
                >
                  {t("nav.contact")}
                </Button>
              </>
            ) : (
              <>
                <Link href="/">
                  <Button
                    variant="ghost"
                    className="cursor-pointer"
                  >
                    {t("nav.properties")}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="cursor-pointer"
                  onClick={() => scrollToSection("contact")}
                >
                  {t("nav.contact")}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}