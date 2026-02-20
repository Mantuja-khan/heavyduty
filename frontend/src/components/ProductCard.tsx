import { Link } from "react-router-dom";
import { Package, Eye } from "lucide-react";
import type { Product } from "@/hooks/useProducts";

interface Props {
  product: Product;
  onInquiry?: (product: Product) => void;
  onBuy?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

const ProductCard = ({ product, onInquiry, onBuy, onViewDetails }: Props) => (
  <div className="bg-card border border-border group hover:border-primary/40 transition-all duration-300 overflow-hidden flex flex-col h-full">
    {/* Image — shorter on mobile, taller on larger screens */}
    <div className="aspect-[3/2] sm:aspect-[4/3] bg-muted flex items-center justify-center relative overflow-hidden flex-shrink-0">
      {product.image_url ? (
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <Package className="h-10 w-10 sm:h-16 sm:w-16 text-muted-foreground/30" />
      )}
      <span
        className={`absolute top-2 left-2 sm:top-3 sm:left-3 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-heading tracking-wider ${product.category === "Trading"
          ? "bg-secondary text-secondary-foreground"
          : "bg-primary text-primary-foreground"
          }`}
      >
        {product.category.toUpperCase()}
      </span>
    </div>

    {/* Content */}
    <div className="p-3 sm:p-5 flex flex-col flex-grow">
      <div className="flex-grow">
        <h3 className="font-heading text-sm sm:text-base text-foreground mb-0.5 sm:mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-[11px] sm:text-xs text-muted-foreground mb-2 sm:mb-3 line-clamp-2 overflow-hidden">
          {product.description}
        </p>

        {product.category === "Manufacturing" && product.price && (
          <p className="font-heading text-base sm:text-lg text-primary mb-2 sm:mb-3">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </p>
        )}
      </div>

      <div className="flex gap-1.5 sm:gap-2 mt-auto">
        <Link
          to={`/product/${product.slug}`}
          className="flex-1 py-2 sm:py-2.5 border border-border text-foreground font-heading text-[10px] sm:text-xs tracking-wider hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1 sm:gap-1.5"
        >
          <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <span className="hidden xs:inline">VIEW DETAILS</span>
          <span className="xs:hidden">VIEW</span>
        </Link>

        {product.category === "Trading" ? (
          <button
            onClick={() => onInquiry?.(product)}
            className="flex-1 py-2 sm:py-2.5 bg-surface-dark text-surface-dark-foreground font-heading text-[10px] sm:text-xs tracking-wider hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <span className="hidden xs:inline">GET QUOTE</span>
            <span className="xs:hidden">QUOTE</span>
          </button>
        ) : (
          <button
            onClick={() => onBuy?.(product)}
            className="flex-1 py-2 sm:py-2.5 bg-primary text-primary-foreground font-heading text-[10px] sm:text-xs tracking-wider hover:bg-primary/90 transition-colors"
          >
            BUY NOW
          </button>
        )}
      </div>
    </div>
  </div>
);

export default ProductCard;