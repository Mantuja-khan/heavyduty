import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { format } from "date-fns";
import { Calendar, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const BlogDetail = () => {
    const { slug } = useParams<{ slug: string }>();

    const { data: blog, isLoading, error } = useQuery({
        queryKey: ["blog", slug],
        queryFn: () => api.getBlog(slug || ""),
        enabled: !!slug,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-black animate-spin" />
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center p-4 gap-6">
                    <div className="text-center">
                        <p className="text-xs tracking-[0.3em] text-gray-400 uppercase mb-3">404</p>
                        <h1 className="text-3xl font-semibold text-black mb-2">Article Not Found</h1>
                        <p className="text-gray-500 text-sm">The article you're looking for doesn't exist or has been moved.</p>
                    </div>
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 text-sm font-medium text-black border border-black px-5 py-2.5 hover:bg-black hover:text-white transition-colors duration-200"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back to Blog
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />

            <main className="flex-grow pt-20 sm:pt-24 pb-20">
                {/* Back Link */}
                <div className="container mx-auto max-w-6xl px-4 sm:px-6 mb-10 sm:mb-14">
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-gray-400 hover:text-black transition-colors duration-200 group"
                    >
                        <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform duration-200" />
                        Back to Articles
                    </Link>
                </div>

                <article className="container mx-auto max-w-6xl px-4 sm:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        {/* Meta */}
                        <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-gray-400 mb-5 font-medium">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{format(new Date(blog.createdAt), "MMMM d, yyyy")}</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black leading-tight tracking-tight mb-8 sm:mb-10">
                            {blog.title}
                        </h1>

                        {/* Divider */}
                        <div className="w-12 h-px bg-black mb-8 sm:mb-10" />

                        {/* Hero Image */}
                        {blog.image_url && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                                className="w-full rounded-lg overflow-hidden mb-10 sm:mb-14"
                                style={{ aspectRatio: "16/9" }}
                            >
                                <img
                                    src={blog.image_url}
                                    alt={blog.title}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        )}

                        {/* Content */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.25 }}
                            className="text-gray-800 text-base sm:text-lg leading-relaxed sm:leading-loose whitespace-pre-wrap"
                            style={{
                                fontFamily: "'Georgia', 'Times New Roman', serif",
                                letterSpacing: "0.01em",
                            }}
                        >
                            {blog.content}
                        </motion.div>

                        {/* Footer Divider */}
                        <div className="mt-14 sm:mt-20 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <p className="text-xs tracking-widest uppercase text-gray-400">
                                Published {format(new Date(blog.createdAt), "MMMM d, yyyy")}
                            </p>
                            <Link
                                to="/blog"
                                className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-medium text-black hover:opacity-60 transition-opacity duration-200"
                            >
                                <ArrowLeft className="h-3.5 w-3.5" />
                                All Articles
                            </Link>
                        </div>
                    </motion.div>
                </article>
            </main>

            <Footer />
        </div>
    );
};

export default BlogDetail;