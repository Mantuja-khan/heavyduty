import { Link } from "react-router-dom";
import { HardHat, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="bg-surface-dark text-surface-dark-foreground">
    <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <HardHat className="h-6 w-6 text-primary" />
          <span className="font-heading text-lg tracking-wider">
            HEAVYBUILD <span className="text-primary">PRO</span>
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          India's trusted partner for heavy construction machinery — trading and manufacturing premium equipment since 2005.
        </p>
      </div>

      <div>
        <h4 className="font-heading text-sm tracking-widest text-primary mb-4">QUICK LINKS</h4>
        <div className="flex flex-col gap-2 text-sm">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
          <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
          <Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
        </div>
      </div>

      <div>
        <h4 className="font-heading text-sm tracking-widest text-primary mb-4">CONTACT</h4>
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> +91 98765 43210</div>
          <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> info@heavybuildpro.com</div>
          <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Industrial Area, Pune, India</div>
        </div>
      </div>
    </div>
    <div className="border-t border-primary/10 text-center py-4 text-xs text-muted-foreground">
      © {new Date().getFullYear()} HeavyBuild Pro. All rights reserved.
    </div>
  </footer>
);

export default Footer;
