import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useReviews, useAddReview, useDeleteReview } from "@/hooks/useProducts";
import {
    Star,
    ShoppingCart,
    Zap,
    Heart,
    Tag,
    Trash2,
    Package,
    ChevronRight,
    CheckCircle2,
    MessageSquare,
    ArrowRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import InquiryModal from "@/components/InquiryModal";

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, delay: i * 0.07, ease: "easeOut" },
    }),
};

const StarRating = ({
    value,
    size = "md",
}: {
    value: number;
    size?: "sm" | "md";
}) => {
    const px = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <Star
                    key={s}
                    className={`${px} ${s <= Math.round(value)
                        ? "text-amber-400 fill-amber-400"
                        : "text-border fill-transparent"
                        }`}
                />
            ))}
        </div>
    );
};

const ProductDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [name, setName] = useState("");
    const [comment, setComment] = useState("");
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
    const [wishlisted, setWishlisted] = useState(false);

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) setCurrentUser(JSON.parse(userStr));
    }, []);

    const { data: product, isLoading: isProductLoading } = useQuery({
        queryKey: ["product", slug],
        queryFn: () => (slug ? api.getProduct(slug) : null),
        enabled: !!slug,
    });

    const { data: reviews } = useReviews(product?._id);
    const addReviewMutation = useAddReview();
    const deleteReviewMutation = useDeleteReview();

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (!product) return;
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }
        addReviewMutation.mutate(
            { productId: product._id, data: { name, rating, comment } },
            {
                onSuccess: () => {
                    toast.success("Review submitted!");
                    setName("");
                    setComment("");
                    setRating(0);
                },
                onError: (error) => toast.error(`Failed: ${error.message}`),
            }
        );
    };

    const handleDeleteReview = (reviewId: string) => {
        if (!confirm("Delete this review?")) return;
        deleteReviewMutation.mutate(
            { productId: product._id, reviewId },
            {
                onSuccess: () => toast.success("Review deleted"),
                onError: (err) => toast.error(err.message),
            }
        );
    };

    /* ── Loading ── */
    if (isProductLoading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-muted-foreground text-sm font-heading tracking-wider">
                        LOADING
                    </p>
                </div>
            </div>
        );

    /* ── Not Found ── */
    if (!product)
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center space-y-3">
                    <Package className="h-14 w-14 text-muted-foreground/30 mx-auto" />
                    <h2 className="font-heading text-xl text-foreground">
                        Product Not Found
                    </h2>
                    <Link
                        to="/products"
                        className="text-sm text-primary hover:underline font-heading tracking-wider"
                    >
                        ← BACK TO PRODUCTS
                    </Link>
                </div>
            </div>
        );

    /* ── Derived Data ── */
    const avgRating =
        reviews && reviews.length > 0
            ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) /
            reviews.length
            : 0;

    const ratingCounts = [0, 0, 0, 0, 0];
    reviews?.forEach((r: any) => {
        if (r.rating >= 1 && r.rating <= 5) ratingCounts[5 - r.rating]++;
    });

    const isTrading = product.category === "Trading";
    const discountedPrice = product.price
        ? Math.round(product.price * 1.2)
        : null;

    return (
        <div className="bg-background min-h-screen flex flex-col">
            <Navbar />

            <main className="pt-16 flex-grow">
                {/* ── Breadcrumb ── */}
                <div className="border-b border-border bg-card">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-1.5 text-xs text-muted-foreground font-heading tracking-wide">
                        <Link to="/" className="hover:text-primary transition-colors">
                            HOME
                        </Link>
                        <ChevronRight className="h-3 w-3" />
                        <Link
                            to="/products"
                            className="hover:text-primary transition-colors"
                        >
                            PRODUCTS
                        </Link>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-foreground truncate max-w-[180px] sm:max-w-xs">
                            {product.name.toUpperCase()}
                        </span>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
                    {/* ══════════════════════════════════════
              TOP SECTION — Image + Core Info
          ══════════════════════════════════════ */}
                    <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 mb-10 sm:mb-14">
                        {/* Image Panel */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.45 }}
                            className="relative"
                        >
                            {/* Category badge */}
                            <span
                                className={`absolute top-4 left-4 z-10 px-3 py-1 text-[10px] font-heading tracking-widest ${isTrading
                                    ? "bg-secondary text-secondary-foreground"
                                    : "bg-primary text-primary-foreground"
                                    }`}
                            >
                                {product.category.toUpperCase()}
                            </span>

                            {/* Wishlist */}
                            <button
                                onClick={() => setWishlisted((w) => !w)}
                                className="absolute top-4 right-4 z-10 p-2 bg-card border border-border hover:border-primary transition-colors"
                                aria-label="Wishlist"
                            >
                                <Heart
                                    className={`w-4 h-4 transition-colors ${wishlisted
                                        ? "fill-red-500 text-red-500"
                                        : "text-muted-foreground"
                                        }`}
                                />
                            </button>

                            {/* Image container */}
                            <div className="aspect-square bg-muted border border-border flex items-center justify-center overflow-hidden">
                                {product.image_url ? (
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="w-full h-full object-contain p-6 hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-3 text-muted-foreground/30">
                                        <Package className="w-20 h-20" />
                                        <span className="text-xs font-heading tracking-widest">
                                            NO IMAGE
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Stock indicator strip */}
                            <div
                                className={`mt-3 px-4 py-2 text-xs font-heading tracking-wider flex items-center gap-2 border ${product.stock > 0
                                    ? "border-green-500/30 bg-green-500/5 text-green-600"
                                    : "border-red-500/30 bg-red-500/5 text-red-500"
                                    }`}
                            >
                                <span
                                    className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"
                                        }`}
                                />
                                {product.stock > 0
                                    ? `IN STOCK — ${product.stock} UNITS`
                                    : "OUT OF STOCK"}
                            </div>
                        </motion.div>

                        {/* Info Panel */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.45, delay: 0.05 }}
                            className="flex flex-col"
                        >
                            <h1 className="font-heading text-2xl sm:text-3xl text-foreground mb-3 leading-tight">
                                {product.name}
                            </h1>

                            {/* Rating row */}
                            <div className="flex items-center gap-3 mb-5">
                                <StarRating value={avgRating} />
                                <span className="text-sm text-muted-foreground">
                                    {avgRating > 0 ? avgRating.toFixed(1) : "No"} ·{" "}
                                    {reviews?.length || 0} review
                                    {reviews?.length !== 1 ? "s" : ""}
                                </span>
                            </div>

                            {/* Price */}
                            <div className="mb-6 pb-6 border-b border-border">
                                {isTrading ? (
                                    <p className="text-sm text-muted-foreground font-heading tracking-wider">
                                        CONTACT FOR PRICING
                                    </p>
                                ) : product.price ? (
                                    <div className="flex items-baseline gap-3 flex-wrap">
                                        <span className="font-heading text-3xl sm:text-4xl text-foreground">
                                            ₹{Number(product.price).toLocaleString("en-IN")}
                                        </span>
                                        {discountedPrice && (
                                            <>
                                                <span className="text-muted-foreground line-through text-base">
                                                    ₹{discountedPrice.toLocaleString("en-IN")}
                                                </span>
                                                <span className="text-xs bg-green-500/10 text-green-600 border border-green-500/20 px-2 py-0.5 font-heading tracking-wider">
                                                    20% OFF
                                                </span>
                                            </>
                                        )}
                                    </div>
                                ) : null}
                            </div>

                            {/* Description */}
                            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                                {product.description}
                            </p>

                            {/* Offers */}
                            <div className="mb-8 space-y-2.5">
                                <p className="text-xs font-heading tracking-widest text-muted-foreground mb-3">
                                    AVAILABLE OFFERS
                                </p>
                                {[
                                    "5% unlimited cashback on Axis Bank Credit Card",
                                    "Extra 10% off — price inclusive of discount",
                                    "Sign up for Pay Later & get gift card worth ₹100",
                                ].map((offer, i) => (
                                    <div key={i} className="flex items-start gap-2.5 text-sm">
                                        <Tag className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                                        <span className="text-muted-foreground">{offer}</span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Buttons */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
                                {isTrading ? (
                                    <button
                                        onClick={() => setInquiryModalOpen(true)}
                                        className="col-span-full py-3.5 bg-surface-dark text-surface-dark-foreground font-heading text-sm tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center gap-2 group"
                                    >
                                        GET QUOTE
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => toast.success("Added to cart")}
                                            className="py-3.5 border border-border text-foreground font-heading text-xs tracking-widest hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                                        >
                                            <ShoppingCart className="h-4 w-4" />
                                            ADD TO CART
                                        </button>
                                        <button
                                            onClick={() => {
                                                const token = localStorage.getItem("token");
                                                if (!token) {
                                                    toast.error("Please login to buy");
                                                    navigate("/auth");
                                                } else {
                                                    navigate(`/checkout/${product.slug}`);
                                                }
                                            }}
                                            className="py-3.5 bg-primary text-primary-foreground font-heading text-xs tracking-widest hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 group"
                                        >
                                            <Zap className="h-4 w-4" />
                                            BUY NOW
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* ══════════════════════════════════════
              SPECIFICATIONS
          ══════════════════════════════════════ */}
                    {product.specifications &&
                        Object.keys(product.specifications).length > 0 && (
                            <motion.section
                                custom={0}
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true }}
                                className="mb-10 sm:mb-14"
                            >
                                <h2 className="font-heading text-xs tracking-widest text-primary mb-5">
                                    SPECIFICATIONS
                                </h2>
                                <div className="border border-border divide-y divide-border">
                                    {Object.entries(product.specifications).map(
                                        ([key, value], i) => (
                                            <div
                                                key={key}
                                                className={`grid grid-cols-2 sm:grid-cols-3 gap-4 px-4 sm:px-6 py-3.5 text-sm ${i % 2 === 0 ? "bg-muted/30" : "bg-card"
                                                    }`}
                                            >
                                                <span className="text-muted-foreground col-span-1 font-heading text-xs tracking-wide">
                                                    {key}
                                                </span>
                                                <span className="text-foreground font-medium col-span-1 sm:col-span-2">
                                                    {String(value)}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                            </motion.section>
                        )}

                    {/* ══════════════════════════════════════
              RATINGS & REVIEWS
          ══════════════════════════════════════ */}
                    <motion.section
                        custom={1}
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="font-heading text-xs tracking-widest text-primary">
                                RATINGS & REVIEWS
                            </h2>
                            <button
                                onClick={() =>
                                    document
                                        .getElementById("review-form")
                                        ?.scrollIntoView({ behavior: "smooth" })
                                }
                                className="text-xs font-heading tracking-wider border border-border px-3 py-1.5 hover:border-primary hover:text-primary transition-colors flex items-center gap-1.5"
                            >
                                <MessageSquare className="h-3 w-3" />
                                WRITE A REVIEW
                            </button>
                        </div>

                        <div className="border border-border mb-6">
                            <div className="grid sm:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-border">
                                {/* Score */}
                                <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-muted/20">
                                    <p className="font-heading text-5xl text-foreground mb-1">
                                        {avgRating > 0 ? avgRating.toFixed(1) : "—"}
                                    </p>
                                    <StarRating value={avgRating} />
                                    <p className="text-xs text-muted-foreground mt-2 font-heading tracking-wider">
                                        {reviews?.length || 0} REVIEWS
                                    </p>
                                </div>

                                {/* Distribution */}
                                <div className="p-6 sm:col-span-2">
                                    <div className="space-y-2.5 max-w-sm">
                                        {[5, 4, 3, 2, 1].map((stars, index) => (
                                            <div
                                                key={stars}
                                                className="flex items-center gap-3 text-xs"
                                            >
                                                <span className="w-4 text-right text-muted-foreground font-heading">
                                                    {stars}
                                                </span>
                                                <Star className="w-3 h-3 text-amber-400 fill-amber-400 flex-shrink-0" />
                                                <div className="flex-1 bg-muted h-1.5 overflow-hidden">
                                                    <div
                                                        className={`h-full transition-all duration-700 ${stars >= 4
                                                            ? "bg-green-500"
                                                            : stars === 3
                                                                ? "bg-amber-400"
                                                                : "bg-red-400"
                                                            }`}
                                                        style={{
                                                            width:
                                                                reviews && reviews.length > 0
                                                                    ? `${(ratingCounts[index] / reviews.length) *
                                                                    100
                                                                    }%`
                                                                    : "0%",
                                                        }}
                                                    />
                                                </div>
                                                <span className="w-4 text-muted-foreground">
                                                    {ratingCounts[index]}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Review Cards */}
                        <div className="space-y-4 mb-8">
                            {reviews && reviews.length > 0 ? (
                                reviews.map((review: any, i: number) => (
                                    <motion.div
                                        key={review._id}
                                        custom={i}
                                        variants={fadeUp}
                                        initial="hidden"
                                        whileInView="show"
                                        viewport={{ once: true }}
                                        className="border border-border p-4 sm:p-5 relative group hover:border-primary/30 transition-colors bg-card"
                                    >
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <div className="flex items-center gap-2.5">
                                                <div
                                                    className={`px-2 py-0.5 text-[10px] font-heading tracking-wider flex items-center gap-1 ${review.rating >= 4
                                                        ? "bg-green-500/10 text-green-600 border border-green-500/20"
                                                        : review.rating === 3
                                                            ? "bg-amber-400/10 text-amber-600 border border-amber-400/20"
                                                            : "bg-red-500/10 text-red-500 border border-red-500/20"
                                                        }`}
                                                >
                                                    <Star className="w-2.5 h-2.5 fill-current" />
                                                    {review.rating}
                                                </div>
                                                <span className="font-heading text-sm text-foreground">
                                                    {review.name}
                                                </span>
                                            </div>
                                            <span className="text-xs text-muted-foreground flex-shrink-0">
                                                {new Date(review.createdAt).toLocaleDateString(
                                                    "en-IN",
                                                    { day: "numeric", month: "short", year: "numeric" }
                                                )}
                                            </span>
                                        </div>

                                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                                            {review.comment}
                                        </p>

                                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60 font-heading tracking-wider">
                                            <CheckCircle2 className="w-3 h-3" />
                                            CERTIFIED BUYER
                                        </div>

                                        {currentUser &&
                                            (currentUser._id === review.user ||
                                                currentUser.id === review.user ||
                                                (review.user &&
                                                    typeof review.user === "object" &&
                                                    review.user._id === currentUser.id) ||
                                                currentUser.role === "admin") && (
                                                <button
                                                    onClick={() => handleDeleteReview(review._id)}
                                                    className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                    title="Delete Review"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                    </motion.div>
                                ))
                            ) : (
                                <div className="border border-border p-8 text-center">
                                    <MessageSquare className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                        No reviews yet. Be the first to review this product.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Review Form */}
                        <div
                            id="review-form"
                            className="border border-border p-5 sm:p-8 bg-muted/10"
                        >
                            <h3 className="font-heading text-xs tracking-widest text-primary mb-6">
                                RATE THIS PRODUCT
                            </h3>
                            <form
                                onSubmit={handleSubmitReview}
                                className="space-y-5 max-w-lg"
                            >
                                {/* Star selector */}
                                <div>
                                    <p className="text-xs text-muted-foreground mb-2 font-heading tracking-wide">
                                        YOUR RATING
                                    </p>
                                    <div className="flex gap-1.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className="p-0.5 transition-transform hover:scale-110"
                                            >
                                                <Star
                                                    className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${star <= (hoverRating || rating)
                                                        ? "fill-amber-400 text-amber-400"
                                                        : "text-border fill-transparent"
                                                        }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground mb-1.5 font-heading tracking-wide">
                                        YOUR NAME
                                    </p>
                                    <Input
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="bg-card border-border text-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground mb-1.5 font-heading tracking-wide">
                                        YOUR REVIEW
                                    </p>
                                    <Textarea
                                        placeholder="Share your experience with this product..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="bg-card border-border text-sm min-h-[100px] resize-none"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={addReviewMutation.isPending}
                                    className="py-3 px-8 bg-primary text-primary-foreground font-heading text-xs tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 group"
                                >
                                    {addReviewMutation.isPending ? (
                                        <>
                                            <div className="w-3.5 h-3.5 border border-primary-foreground/50 border-t-primary-foreground rounded-full animate-spin" />
                                            SUBMITTING
                                        </>
                                    ) : (
                                        <>
                                            SUBMIT REVIEW
                                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.section>
                </div>
            </main>

            <Footer />

            {inquiryModalOpen && product && (
                <InquiryModal
                    product={product}
                    onClose={() => setInquiryModalOpen(false)}
                />
            )}
        </div>
    );
};

export default ProductDetail;