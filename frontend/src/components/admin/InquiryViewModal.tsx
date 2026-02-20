import { X, User, Building, Phone, Mail, Package, MessageSquare, Calendar, CheckCircle } from "lucide-react";

interface Props {
    data: any;
    onClose: () => void;
}

const InquiryViewModal = ({ data, onClose }: Props) => {
    if (!data) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-dark/80 backdrop-blur-sm p-4" onClick={onClose}>
            <div
                className="bg-card border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-md shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-border bg-muted/30">
                    <div>
                        <p className="font-heading text-xs tracking-widest text-primary mb-1">INQUIRY DETAILS</p>
                        <h3 className="font-heading text-lg text-foreground flex items-center gap-2">
                            {data.product}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-muted rounded-full">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">

                    {/* Product Image */}
                    {data.productImage && (
                        <div className="w-full h-48 bg-muted rounded-md overflow-hidden mb-4 border border-border">
                            <img src={data.productImage} alt={data.product} className="w-full h-full object-cover" />
                        </div>
                    )}

                    {/* Status Badge */}
                    <div className="flex justify-end">
                        <span className={`px-3 py-1 text-xs font-heading tracking-wider rounded-full flex items-center gap-1.5 ${data.status === "New" ? "bg-primary/20 text-primary" :
                                data.status === "Contacted" ? "bg-blue-100 text-blue-700" :
                                    "bg-green-100 text-green-700"
                            }`}>
                            <CheckCircle className="w-3 h-3" />
                            {data.status.toUpperCase()}
                        </span>
                    </div>

                    <div className="grid gap-4">
                        {/* User Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3 p-3 bg-muted/40 rounded-md">
                                <User className="w-4 h-4 text-primary mt-0.5" />
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Name</p>
                                    <p className="text-sm font-medium text-foreground">{data.name}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-muted/40 rounded-md">
                                <Building className="w-4 h-4 text-primary mt-0.5" />
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Company</p>
                                    <p className="text-sm font-medium text-foreground">{data.company || "N/A"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3 p-3 bg-muted/40 rounded-md">
                                <Phone className="w-4 h-4 text-primary mt-0.5" />
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Phone</p>
                                    <p className="text-sm font-medium text-foreground">{data.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-muted/40 rounded-md">
                                <Mail className="w-4 h-4 text-primary mt-0.5" />
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Email</p>
                                    <p className="text-sm font-medium text-foreground break-all">{data.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Message/Requirements */}
                        <div className="flex items-start gap-3 p-4 bg-muted/40 rounded-md border border-border/50">
                            <MessageSquare className="w-4 h-4 text-primary mt-1" />
                            <div className="w-full">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Requirements / Message</p>
                                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                                    {data.message || "No specific requirements provided."}
                                </p>
                            </div>
                        </div>

                        {/* Timestamp */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2 pl-1">
                            <Calendar className="w-3 h-3" />
                            <span>Submitted on {new Date(data.createdAt).toLocaleString()}</span>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default InquiryViewModal;
