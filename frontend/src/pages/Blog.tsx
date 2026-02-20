import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { CalendarDays, ArrowRight } from "lucide-react";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    image_url: string;
    author: string;
    createdAt: string;
}

const BlogSkeleton = () => (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm animate-pulse">
        <div className="aspect-video bg-gray-200 w-full" />
        <div className="p-5 space-y-3">
            <div className="h-3 bg-gray-200 rounded w-1/3" />
            <div className="h-5 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-5/6" />
            <div className="h-3 bg-gray-200 rounded w-1/4 mt-4" />
        </div>
    </div>
);

const Blog = () => {
    const { data: blogs, isLoading } = useQuery({
        queryKey: ["blogs"],
        queryFn: api.getBlogs,
    });

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />

            {/* Hero Header */}
            <section className="pt-28 pb-12 px-4 text-center border-b border-gray-100">
                <p className="font-heading text-xs tracking-[0.3em] text-primary mb-2 uppercase">Our Blog</p>
                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-gray-900 uppercase tracking-wide">
                    Latest <span className="text-primary">News</span>
                </h1>
                <p className="text-gray-500 text-sm mt-3 max-w-md mx-auto">
                    Stay up to date with the latest industry insights, product launches, and company updates.
                </p>
            </section>

            {/* Blog Grid */}
            <main className="flex-grow container mx-auto px-4 py-12 max-w-6xl">
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => <BlogSkeleton key={i} />)}
                    </div>
                ) : blogs?.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p className="font-heading text-lg">No articles found.</p>
                        <p className="text-sm mt-1">Check back soon for updates.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blogs?.map((blog: BlogPost, index: number) => (
                            <article
                                key={blog.id}
                                className={`bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group ${index === 0 ? "sm:col-span-2 lg:col-span-1" : ""
                                    }`}
                            >
                                {blog.image_url && (
                                    <div className="aspect-video w-full overflow-hidden bg-gray-100">
                                        <img
                                            src={blog.image_url}
                                            alt={blog.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                )}

                                <div className="p-5 flex-1 flex flex-col">
                                    {/* Meta */}
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                                        <CalendarDays className="h-3.5 w-3.5" />
                                        <span>{format(new Date(blog.createdAt), "MMMM d, yyyy")}</span>
                                    </div>

                                    {/* Title */}
                                    <h2 className="font-heading text-base sm:text-lg text-gray-900 mb-2 line-clamp-2 leading-snug">
                                        {blog.title}
                                    </h2>

                                    {/* Excerpt */}
                                    <p className="text-sm text-gray-500 line-clamp-3 flex-1 leading-relaxed">
                                        {blog.content.substring(0, 140)}...
                                    </p>

                                    {/* Read More */}
                                    <Link
                                        to={`/blog/${blog.slug}`}
                                        className="mt-4 inline-flex items-center gap-1.5 text-primary text-xs font-heading tracking-wider hover:gap-2.5 transition-all"
                                    >
                                        READ MORE <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Blog;