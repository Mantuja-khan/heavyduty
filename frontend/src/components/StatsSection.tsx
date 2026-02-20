import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Package, Users, Award, Clock } from "lucide-react";

const stats = [
  { icon: Package, value: "500+", label: "Machines Delivered" },
  { icon: Users, value: "200+", label: "Happy Clients" },
  { icon: Award, value: "18+", label: "Years Experience" },
  { icon: Clock, value: "24/7", label: "Support Available" },
];

const StatsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-surface-dark section-padding">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="text-center"
          >
            <s.icon className="h-8 w-8 text-primary mx-auto mb-3" />
            <p className="font-heading text-3xl md:text-4xl text-surface-dark-foreground">{s.value}</p>
            <p className="text-sm text-muted-foreground mt-1 tracking-wide">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
