import { X, Package } from "lucide-react";
import type { Product } from "@/hooks/useProducts";

interface Props {
  product: Product;
  onClose: () => void;
  onInquiry?: (product: Product) => void;
  onBuy?: (product: Product) => void;
}

const ProductDetailModal = ({ product, onClose, onInquiry, onBuy }: Props) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-dark/80 backdrop-blur-sm p-4" onClick={onClose}>
    <div
      className="bg-card border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div>
          <span className={`px-3 py-1 text-xs font-heading tracking-wider ${product.category === "Trading"
            ? "bg-secondary text-secondary-foreground"
            : "bg-primary text-primary-foreground"
            }`}>
            {product.category.toUpperCase()}
          </span>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Image */}
      <div className="aspect-video bg-muted flex items-center justify-center">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <Package className="h-20 w-20 text-muted-foreground/30" />
        )}
      </div>

      {/* Details */}
      <div className="p-6">
        <h2 className="font-heading text-2xl text-foreground mb-2">{product.name}</h2>
        <p className="text-sm text-muted-foreground mb-6">{product.description}</p>

        {product.category === "Manufacturing" && product.price && (
          <p className="font-heading text-2xl text-primary mb-4">₹{Number(product.price).toLocaleString("en-IN")}</p>
        )}

        {/* Specifications */}
        <h3 className="font-heading text-sm tracking-widest text-primary mb-3">SPECIFICATIONS</h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {Object.entries(product.specifications).map(([key, val]) => (
            <div key={key} className="bg-muted p-3">
              <p className="text-xs text-muted-foreground mb-1">{key}</p>
              <p className="text-sm font-medium text-foreground">{val}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mb-4">Stock: {product.stock} units</p>

        {/* Action buttons */}
        <div className="flex gap-3">
          {product.category === "Trading" ? (
            <button
              onClick={() => onInquiry?.(product)}
              className="flex-1 py-3 bg-surface-dark text-surface-dark-foreground font-heading text-sm tracking-wider hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              GET QUOTE
            </button>
          ) : (
            <button
              onClick={() => onBuy?.(product)}
              className="flex-1 py-3 bg-primary text-primary-foreground font-heading text-sm tracking-wider hover:bg-primary/90 transition-colors"
            >
              BUY NOW
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default ProductDetailModal;
