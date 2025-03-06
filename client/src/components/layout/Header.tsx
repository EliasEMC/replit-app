import { useTranslation } from "react-i18next";
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function Header() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();

  return (
    <div className="w-full bg-primary text-white py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex-1">
          <img src="/logo.svg" alt="Company Logo" className="h-8" />
        </div>
        
        <div className="flex items-center gap-4">
          <span className="hidden md:inline">+1 (555) 123-4567</span>
          
          <div className="flex gap-2">
            <a href="#" className="hover:opacity-80"><FaFacebook size={20} /></a>
            <a href="#" className="hover:opacity-80"><FaInstagram size={20} /></a>
            <a href="#" className="hover:opacity-80"><FaYoutube size={20} /></a>
            <a href="#" className="hover:opacity-80"><FaLinkedin size={20} /></a>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => i18n.changeLanguage(i18n.language === "en" ? "es" : "en")}
            >
              {i18n.language === "en" ? "ES" : "EN"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
