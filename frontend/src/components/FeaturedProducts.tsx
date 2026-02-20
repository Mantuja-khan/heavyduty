import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useFeaturedProducts, type Product } from "@/hooks/useProducts";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import ProductDetailModal from "./ProductDetailModal";
import InquiryModal from "./InquiryModal";
import { toast } from "sonner";

const FeaturedProducts = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { data: products = [], isLoading } = useFeaturedProducts();
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [inquiryProduct, setInquiryProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  const handleBuy = (product: Product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to buy products");
      navigate("/auth");
    } else {
      navigate(`/checkout/${product.slug}`);
    }
  };

  return (
    <section ref={ref} className="section-padding bg-muted/50 w-full">
      <div className="w-full px-4 md:container md:mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12"
        >
          <div>
            <p className="font-heading text-sm tracking-[0.3em] text-primary mb-2">OUR EQUIPMENT</p>
            <h2 className="font-heading text-3xl md:text-4xl text-foreground">
              FEATURED <span className="text-primary">PRODUCTS</span>
            </h2>
          </div>
          <Link
            to="/products"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 font-heading text-sm tracking-wider text-primary hover:underline"
          >
            VIEW ALL <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} className={i >= 2 ? "hidden sm:block" : ""} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                className={i >= 2 ? "hidden sm:block" : ""}
              >
                <ProductCard
                  product={product}
                  onViewDetails={setDetailProduct}
                  onInquiry={setInquiryProduct}
                  onBuy={handleBuy}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Explore Products button */}
        <div className="text-center mt-10">
          <Link
            to="/products"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground font-heading text-sm tracking-wider hover:bg-primary/90 transition-colors"
          >
            EXPLORE ALL PRODUCTS
          </Link>
        </div>
      </div>

      {detailProduct && (
        <ProductDetailModal
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
          onInquiry={(p) => { setDetailProduct(null); setInquiryProduct(p); }}
          onBuy={handleBuy}
        />
      )}
      {inquiryProduct && <InquiryModal product={inquiryProduct} onClose={() => setInquiryProduct(null)} />}
    </section>
  );
};

export default FeaturedProducts;