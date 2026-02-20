import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ShieldCheck, Wrench, TrendingUp } from "lucide-react";

const features = [
  { icon: ShieldCheck, title: "TRUSTED QUALITY", desc: "ISO-certified equipment with rigorous quality checks and industry-leading warranties." },
  { icon: Wrench, title: "FULL SERVICE", desc: "End-to-end support from consultation to after-sales maintenance and spare parts." },
  { icon: TrendingUp, title: "BEST PRICING", desc: "Competitive prices on trading machines and factory-direct rates on our manufactured products." },
];

const AboutSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="font-heading text-sm tracking-[0.3em] text-primary mb-2">WHY CHOOSE US</p>
          <h2 className="font-heading text-3xl md:text-4xl text-foreground">
            BUILT FOR <span className="text-primary">PERFORMANCE</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
              className="bg-card border border-border p-8 hover:border-primary/40 transition-colors group"
            >
              <f.icon className="h-10 w-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-heading text-lg text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
