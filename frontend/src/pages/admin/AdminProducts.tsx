import { useState } from "react";
import { Trash2, Edit, Plus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useProducts, type Product } from "@/hooks/useProducts";
import { api } from "@/services/api";
import { useQueryClient } from "@tanstack/react-query";

interface ProductForm {
  name: string;
  slug: string;
  category: "Trading" | "Manufacturing";
  description: string;
  specifications: string;
  price: string;
  image_url: string;
  stock: string;
  featured: boolean;
}

const emptyForm: ProductForm = {
  name: "",
  slug: "",
  category: "Trading",
  description: "",
  specifications: "{}",
  price: "",
  image_url: "",
  stock: "0",
  featured: false,
};

const AdminProducts = () => {
  const { data: products = [], isLoading } = useProducts();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      slug: p.slug,
      category: p.category,
      description: p.description,
      specifications: JSON.stringify(p.specifications, null, 2),
      price: p.price ? String(p.price) : "",
      image_url: p.image_url ?? "",
      stock: String(p.stock),
      featured: p.featured,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem("token") || "";

    let specs: Record<string, string> = {};
    try {
      specs = JSON.parse(form.specifications);
    } catch {
      toast.error("Invalid JSON in specifications.");
      setSaving(false);
      return;
    }

    const payload = {
      name: form.name,
      slug: form.slug,
      category: form.category,
      description: form.description,
      specifications: specs,
      price: form.price ? Number(form.price) : null,
      image_url: form.image_url || null,
      stock: Number(form.stock),
      featured: form.featured,
    };

    try {
      if (editingId) {
        await api.updateProduct(editingId, payload, token);
        toast.success("Product updated.");
      } else {
        await api.createProduct(payload, token);
        toast.success("Product added.");
      }
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setShowForm(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.deleteProduct(id, localStorage.getItem("token") || "");
      toast.success("Product deleted.");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const inputCls = "w-full px-4 py-2.5 bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl text-foreground">PRODUCTS</h1>
        <button
          onClick={openAdd}
          className="px-5 py-2.5 bg-primary text-primary-foreground font-heading text-xs tracking-wider hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> ADD PRODUCT
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-dark/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-heading text-lg text-foreground">{editingId ? "EDIT PRODUCT" : "ADD PRODUCT"}</h3>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-3">
              <input required placeholder="Product Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
              <input required placeholder="Slug *" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputCls} />
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as "Trading" | "Manufacturing" })} className={inputCls}>
                <option value="Trading">Trading</option>
                <option value="Manufacturing">Manufacturing</option>
              </select>
              <textarea rows={2} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls + " resize-none"} />
              <textarea rows={4} placeholder='Specifications (JSON) e.g. {"Key":"Value"}' value={form.specifications} onChange={(e) => setForm({ ...form, specifications: e.target.value })} className={inputCls + " resize-none font-mono text-xs"} />
              <input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className={inputCls} />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputCls} />
                <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className={inputCls} />
              </div>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-primary" />
                Featured product
              </label>
              <button type="submit" disabled={saving} className="w-full py-3 bg-primary text-primary-foreground font-heading text-sm tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {saving ? "SAVING..." : editingId ? "UPDATE PRODUCT" : "ADD PRODUCT"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="bg-card border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 font-heading text-xs tracking-wider text-muted-foreground">NAME</th>
                <th className="px-5 py-3 font-heading text-xs tracking-wider text-muted-foreground">CATEGORY</th>
                <th className="px-5 py-3 font-heading text-xs tracking-wider text-muted-foreground">PRICE</th>
                <th className="px-5 py-3 font-heading text-xs tracking-wider text-muted-foreground">STOCK</th>
                <th className="px-5 py-3 font-heading text-xs tracking-wider text-muted-foreground">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="px-5 py-3 font-medium">{p.name}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 text-xs font-heading tracking-wider ${p.category === "Trading" ? "bg-secondary text-secondary-foreground" : "bg-primary/20 text-primary"
                      }`}>{p.category.toUpperCase()}</span>
                  </td>
                  <td className="px-5 py-3">{p.price ? `₹${Number(p.price).toLocaleString("en-IN")}` : "—"}</td>
                  <td className="px-5 py-3">{p.stock}</td>
                  <td className="px-5 py-3 flex gap-2">
                    <button onClick={() => openEdit(p)} className="p-1.5 hover:text-primary transition-colors"><Edit className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
