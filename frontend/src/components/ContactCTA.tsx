import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ContactCTA = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-surface-dark relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="relative container mx-auto text-center"
      >
        <p className="font-heading text-sm tracking-[0.3em] text-primary mb-2">READY TO BUILD?</p>
        <h2 className="font-heading text-3xl md:text-5xl text-surface-dark-foreground mb-6">
          LET'S DISCUSS YOUR <span className="text-primary">PROJECT</span>
        </h2>
        <p className="text-surface-dark-foreground/60 max-w-lg mx-auto mb-8">
          Get in touch for competitive quotes on heavy machinery — trading or manufacturing.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center px-10 py-4 bg-primary text-primary-foreground font-heading tracking-wider text-sm hover:bg-primary/90 transition-colors"
        >
          CONTACT US
        </Link>
      </motion.div>
    </section>
  );
};

export default ContactCTA;
