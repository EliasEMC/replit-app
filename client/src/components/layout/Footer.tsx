import { useTranslation } from "react-i18next";
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img src="/logo.svg" alt="Company Logo" className="h-8 mb-4" />
            <p className="text-sm opacity-80">
              123 Business Street<br />
              City, State 12345<br />
              +1 (555) 123-4567<br />
              info@company.com
            </p>
          </div>
          
          <div className="flex justify-center md:justify-end col-span-3">
            <div className="flex gap-4">
              <a href="#" className="hover:opacity-80"><FaFacebook size={24} /></a>
              <a href="#" className="hover:opacity-80"><FaInstagram size={24} /></a>
              <a href="#" className="hover:opacity-80"><FaYoutube size={24} /></a>
              <a href="#" className="hover:opacity-80"><FaLinkedin size={24} /></a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/20 text-center text-sm opacity-80">
          © {currentYear} Company Name. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
