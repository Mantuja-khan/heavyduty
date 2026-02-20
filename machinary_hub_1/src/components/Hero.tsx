import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => (
  <section className="relative h-screen flex items-center justify-center overflow-hidden">
    {/* Background */}
    <div className="absolute inset-0">
      <img src={heroBg} alt="Heavy machinery at construction site" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-surface-dark/70" />
    </div>
    {/* Content */}
    <div className="relative z-10 containfer mx-auto px-4 text-center">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-heading text-sm md:text-base tracking-[0.3em] text-primary mb-4"
      >
        INDIA'S TRUSTED EQUIPMENT PARTNER
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="font-heading text-4xl sm:text-5xl md:text-7xl text-surface-dark-foreground leading-tight mb-6"
      >
        POWER YOUR <br />
        <span className="text-primary">CONSTRUCTION</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-surface-dark-foreground/70 max-w-xl mx-auto mb-8 text-base md:text-lg"
      >
        Premium heavy machinery for trading & manufacturing. Excavators, loaders, cranes, and industrial equipment.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Link
          to="/products"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-heading tracking-wider text-sm hover:bg-primary/90 transition-colors"
        >
          EXPLORE PRODUCTS <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          to="/contact"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-primary/50 text-primary font-heading tracking-wider text-sm hover:bg-primary/10 transition-colors"
        >
          GET A QUOTE
        </Link>
      </motion.div>
    </div>

  </section>
);

export default Hero;
