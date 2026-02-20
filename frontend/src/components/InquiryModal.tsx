import { useState } from "react";
import { X } from "lucide-react";
import type { Product } from "@/hooks/useProducts";
import { toast } from "sonner";
import { api } from "@/services/api";

const API_URL = "http://localhost:4000/api";


interface Props {
  product: Product;
  onClose: () => void;
}

const InquiryModal = ({ product, onClose }: Props) => {
  const [form, setForm] = useState({ name: "", companyName: "", phone: "", email: "", requirements: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createEnquiry({
        name: form.name,
        email: form.email,
        phone: form.phone,
        companyName: form.companyName, // stays same
        product: product.name,
        productImage: product.image_url,
        message: form.requirements
      });

      toast.success("Inquiry submitted! We'll get back to you within 24 hours.");
      setForm({ name: "", companyName: "", phone: "", email: "", requirements: "" });
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit inquiry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-dark/80 backdrop-blur-sm p-4">
      <div className="bg-card border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <p className="font-heading text-xs tracking-widest text-primary">GET QUOTE</p>
            <h3 className="font-heading text-lg text-foreground">{product.name}</h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <input required placeholder="Your Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
          <input placeholder="Company Name" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} className="w-full px-4 py-3 bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
          <input required type="tel" placeholder="Phone Number *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
          <input required type="email" placeholder="Email Address *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
          <textarea rows={3} placeholder="Specific Requirements" value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} className="w-full px-4 py-3 bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none" />
          <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-primary-foreground font-heading text-sm tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50">
            {loading ? "SUBMITTING..." : "SUBMIT INQUIRY"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InquiryModal;
