import { motion } from "framer-motion";
import { ShieldCheck, Wrench, TrendingUp, Users, Award, Globe } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ── Replace these with your actual asset imports ──
// import heroCta from "@/assets/hero-bg.jpg";
// import storyImg from "@/assets/story.jpg";
const heroCta = "https://i.pinimg.com/1200x/8a/d0/1e/8ad01ec3d4a6cccdce109c327ab244eb.jpg";
const storyImg = "https://i.pinimg.com/1200x/67/26/e2/6726e2ac0dec50413074c698eaff2b37.jpg";

const values = [
  {
    icon: ShieldCheck,
    title: "TRUSTED QUALITY",
    desc: "ISO-certified equipment with rigorous quality checks and industry-leading warranties on every product.",
    bg: "https://i.pinimg.com/736x/54/bb/01/54bb01e4dade67c0f308cf494037be1d.jpg",
  },
  {
    icon: Wrench,
    title: "FULL SERVICE",
    desc: "End-to-end support from consultation to after-sales maintenance and spare parts availability.",
    bg: "https://i.pinimg.com/736x/c1/26/10/c1261013de4b870bd8b51570e0d9f848.jpg",
  },
  {
    icon: TrendingUp,
    title: "BEST PRICING",
    desc: "Competitive prices on trading machines and factory-direct rates on our manufactured products.",
    bg: "https://i.pinimg.com/736x/c0/c2/d0/c0c2d02e4c3e5cd28fa30bad15b0abd5.jpg",
  },
  {
    icon: Users,
    title: "EXPERT TEAM",
    desc: "50+ years of combined experience across our engineering and sales teams.",
    bg: "https://i.pinimg.com/736x/5e/c3/79/5ec379ec3bd5b5a1350df577e5297692.jpg",
  },
  {
    icon: Award,
    title: "AWARD WINNING",
    desc: "Recognized as a top heavy equipment supplier in India for 5 consecutive years.",
    bg: "https://i.pinimg.com/1200x/9e/46/b4/9e46b4211ce0e2889f2f726422e5de9f.jpg",
  },
  {
    icon: Globe,
    title: "PAN-INDIA REACH",
    desc: "Serving customers across all major Indian cities with rapid delivery and setup support.",
    bg: "https://i.pinimg.com/736x/b2/4a/38/b24a38fcb6ab4b231178e0171a43b5f0.jpg",
  },
];

const stats = [
  { value: "500+", label: "Machines Delivered" },
  { value: "200+", label: "Happy Clients" },
  { value: "18+", label: "Years Experience" },
  { value: "15+", label: "States Covered" },
];

const About = () => (
  <>
    <Navbar />
    <main className="pt-16">

      {/* ── Hero / CTA with Background Image ── */}
      <section className="relative section-padding text-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={heroCta}
            alt="Construction site background"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay so text stays readable */}
          <div className="absolute inset-0 bg-surface-dark/75" />
          {/* Subtle vignette at bottom */}
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <p className="font-heading text-sm tracking-[0.3em] text-primary mb-2">ABOUT US</p>
          <h1 className="font-heading text-4xl md:text-5xl text-surface-dark-foreground mb-4">
            POWERING <span className="text-primary">INDIA'S</span> GROWTH
          </h1>
          <p className="text-surface-dark-foreground/70 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            HeavyBuild Pro is India's trusted partner for heavy construction machinery. We trade world-class
            equipment from leading brands and manufacture our own line of high-performance construction tools —
            all built to endure the toughest job sites.
          </p>
        </motion.div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-primary py-12">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <p className="font-heading text-3xl md:text-4xl text-primary-foreground">{s.value}</p>
              <p className="font-heading text-xs tracking-widest text-primary-foreground/70 mt-1">
                {s.label.toUpperCase()}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Our Story — left text + right image ── */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex-1 max-w-xl"
            >
              <p className="font-heading text-sm tracking-[0.3em] text-primary mb-2">OUR STORY</p>
              <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-8">
                FROM <span className="text-primary">WORKSHOP</span> TO WAREHOUSE
              </h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  Founded in 2005 in Pune, HeavyBuild Pro started as a small workshop manufacturing concrete
                  mixers and vibrators for local contractors. Our commitment to quality quickly earned us a
                  reputation that spread beyond Maharashtra.
                </p>
                <p>
                  By 2012, we expanded into trading — partnering with global brands like JCB, CAT, Komatsu,
                  and Liebherr to bring world-class heavy machinery to Indian construction sites. Today, we
                  operate from a 50,000 sq. ft. facility with a dedicated showroom, service center, and spare
                  parts warehouse.
                </p>
                <p>
                  Our dual model — trading premium imported machines while manufacturing our own line of
                  construction equipment — gives our customers unmatched choice, value, and after-sales
                  support under one roof.
                </p>
              </div>
            </motion.div>

            {/* Right: Image */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex-1 w-full"
            >
              <div className="relative">
                {/* Accent border offset */}
                <div className="absolute -top-3 -right-3 inset-0 border-2 border-primary/30 z-0" />
                <div className="relative z-10 overflow-hidden">
                  <img
                    src={storyImg}
                    alt="Our facility and team"
                    className="w-full h-80 lg:h-[420px] object-cover"
                  />
                  {/* Overlay gradient at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
                  {/* Year badge */}
                  <div className="absolute bottom-4 left-4 bg-primary px-4 py-2">
                    <p className="font-heading text-xs tracking-[0.2em] text-primary-foreground">EST. 2005</p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Our Values — cards with background images ── */}
      <section className="section-padding bg-muted/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="font-heading text-sm tracking-[0.3em] text-primary mb-2">OUR VALUES</p>
            <h2 className="font-heading text-3xl md:text-4xl text-foreground">
              WHAT SETS US <span className="text-primary">APART</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative overflow-hidden border border-border hover:border-primary/60 transition-colors group cursor-default"
              >
                {/* Card background image */}
                <div className="absolute inset-0">
                  <img
                    src={v.bg}
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Strong dark overlay so content is always readable */}
                  <div className="absolute inset-0 bg-surface-dark/80 group-hover:bg-surface-dark/70 transition-colors duration-300" />
                </div>

                {/* Card content */}
                <div className="relative z-10 p-8">
                  {/* Icon with primary glow on hover */}
                  <div className="mb-4">
                    <v.icon className="h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="font-heading text-lg text-surface-dark-foreground mb-2">{v.title}</h3>
                  <p className="text-sm text-surface-dark-foreground/65 leading-relaxed">{v.desc}</p>

                  {/* Bottom accent line */}
                  <div className="mt-6 w-8 h-0.5 bg-primary/50 group-hover:w-16 transition-all duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </main>
    <Footer />
  </>
);

export default About;