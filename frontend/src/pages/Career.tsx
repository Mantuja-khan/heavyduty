import { useState } from "react";
import { Upload, CheckCircle2, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/services/api";
import { toast } from "sonner";

const Career = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [coverLetter, setCoverLetter] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            toast.error("Please upload your resume.");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("coverLetter", coverLetter);
        formData.append("resume", file);

        try {
            await api.submitCareer(formData);
            setSubmitted(true);
            toast.success("Application submitted successfully!");
        } catch (error: any) {
            toast.error(error.message || "Failed to submit application.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="flex-grow pt-20 pb-12">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

                        {/* Left Side: Heading + Image + Stats */}
                        <div className="space-y-5">
                            {/* Short heading above image */}
                            <div>
                                <p className="font-heading text-xs tracking-[0.3em] text-primary mb-1">WE'RE HIRING</p>
                                <h1 className="font-heading text-3xl md:text-4xl text-foreground leading-tight">
                                    BUILD YOUR <span className="text-primary">CAREER</span> WITH US
                                </h1>
                                <p className="text-muted-foreground text-sm mt-2 max-w-sm">
                                    Join a team driving innovation in heavy construction machinery across India.
                                </p>
                            </div>

                            {/* Image */}
                            <div className="relative h-56 sm:h-72 md:h-80 lg:h-[340px] rounded-lg overflow-hidden border border-primary/20 shadow-xl">
                                <img
                                    src="https://i.pinimg.com/1200x/5b/99/45/5b9945f67443c5d6aa49b89fc6522310.jpg"
                                    alt="Join our construction team"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20" />
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-surface-dark border border-primary/10 rounded">
                                    <p className="font-heading text-primary text-2xl">10+</p>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">Years Experience</p>
                                </div>
                                <div className="p-4 bg-surface-dark border border-primary/10 rounded">
                                    <p className="font-heading text-primary text-2xl">500+</p>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">Happy Clients</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Form */}
                        <div className="w-full">
                            {submitted ? (
                                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center flex flex-col items-center shadow-md">
                                    <CheckCircle2 className="h-16 w-16 text-primary mb-4" />
                                    <h2 className="font-heading text-xl text-gray-900 mb-2">APPLICATION RECEIVED</h2>
                                    <p className="text-gray-500 text-sm">
                                        Thank you for your interest. We will review your application and get back to you shortly.
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-white border border-gray-200 rounded-lg p-5 sm:p-7 shadow-md">
                                    <div className="mb-6">
                                        <h2 className="font-heading text-2xl text-gray-900 mb-1">JOIN OUR TEAM</h2>
                                        <p className="text-gray-500 text-sm">
                                            We're looking for passionate individuals to help power the construction industry with premium heavy machinery.
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium mb-1 block text-gray-800">Full Name</label>
                                            <input
                                                required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none text-sm"
                                                placeholder="John Doe"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium mb-1 block text-gray-800">Email Address</label>
                                                <input
                                                    required
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none text-sm"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium mb-1 block text-gray-800">Phone Number</label>
                                                <input
                                                    required
                                                    type="tel"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none text-sm"
                                                    placeholder="+91 98765 43210"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium mb-1 block text-gray-800">Cover Letter <span className="text-gray-400 font-normal">(Optional)</span></label>
                                            <textarea
                                                rows={3}
                                                value={coverLetter}
                                                onChange={(e) => setCoverLetter(e.target.value)}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none resize-none text-sm"
                                                placeholder="Tell us why you're a great fit..."
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium mb-1 block text-gray-800">Resume <span className="text-gray-500 font-normal">(PDF / DOC)</span></label>
                                            <div className="border-2 border-dashed border-gray-300 rounded p-5 flex flex-col items-center justify-center text-center hover:border-primary/60 transition-colors cursor-pointer relative bg-gray-50">
                                                <input
                                                    required
                                                    type="file"
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={handleFileChange}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                                <Upload className="h-7 w-7 text-primary/60 mb-2" />
                                                <p className="text-sm font-medium text-gray-700">
                                                    {file ? file.name : "Click to upload or drag and drop"}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">PDF, DOC up to 5MB</p>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-3 bg-primary text-primary-foreground font-heading text-sm tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 rounded"
                                        >
                                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                            {loading ? "SENDING..." : "SUBMIT APPLICATION"}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Career;