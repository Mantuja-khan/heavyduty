import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Message sent! We'll respond within 24 hours.");
    setForm({ name: "", email: "", phone: "", message: "" });
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section className="relative section-padding text-center text-white overflow-hidden">

          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="https://i.pinimg.com/1200x/8a/d0/1e/8ad01ec3d4a6cccdce109c327ab244eb.jpg"   // apni image ka path yaha do
              alt="Contact Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60"></div> {/* Dark Overlay */}
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <p className="font-heading text-sm tracking-[0.3em] text-primary mb-3">
              REACH OUT
            </p>

            <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">
              CONTACT <span className="text-primary">US</span>
            </h1>

            <p className="max-w-2xl mx-auto text-gray-200 text-base md:text-lg">
              Have questions about our machinery products? Our team is ready to assist you.
            </p>
          </motion.div>
        </section>

        <section className="section-padding">
          <div className="container mx-auto grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <h2 className="font-heading text-2xl text-foreground mb-6">SEND A <span className="text-primary">MESSAGE</span></h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input required placeholder="Full Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
                <input required type="email" placeholder="Email Address *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
                <input type="tel" placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
                <textarea required rows={5} placeholder="Your Message *" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none" />
                <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-primary-foreground font-heading text-sm tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {loading ? "SENDING..." : "SEND MESSAGE"}
                </button>
              </form>
            </motion.div>

            {/* Info + Map */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <h2 className="font-heading text-2xl text-foreground mb-6">GET IN <span className="text-primary">TOUCH</span></h2>
              <div className="flex flex-col gap-5 mb-8">
                <div className="flex items-start gap-3"><Phone className="h-5 w-5 text-primary mt-0.5" /><div><p className="font-heading text-sm text-foreground">PHONE</p><p className="text-sm text-muted-foreground">+91 98765 43210</p></div></div>
                <div className="flex items-start gap-3"><Mail className="h-5 w-5 text-primary mt-0.5" /><div><p className="font-heading text-sm text-foreground">EMAIL</p><p className="text-sm text-muted-foreground">info@heavybuildpro.com</p></div></div>
                <div className="flex items-start gap-3"><MapPin className="h-5 w-5 text-primary mt-0.5" /><div><p className="font-heading text-sm text-foreground">ADDRESS</p><p className="text-sm text-muted-foreground">Plot 42, Industrial Area Phase II, Pune 411026, India</p></div></div>
                <div className="flex items-start gap-3"><Clock className="h-5 w-5 text-primary mt-0.5" /><div><p className="font-heading text-sm text-foreground">HOURS</p><p className="text-sm text-muted-foreground">Mon–Sat: 9:00 AM – 6:00 PM</p></div></div>
              </div>
              <div className="aspect-video bg-muted border border-border overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60535.41640668921!2d73.8!3d18.52!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67461101%3A0x828d43bf9d9ee343!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office Location"
                />
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
