import { useState, useEffect } from "react";
import { User, Loader2, LogOut } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/services/api";
import { toast } from "sonner";

const Profile = () => {
    const [user, setUser] = useState<any>(null);
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState<any[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (userStr) {
            const parsedUser = JSON.parse(userStr);
            setUser(parsedUser);
            setUsername(parsedUser.username || "");
            setName(parsedUser.name || "");
            setPhone(parsedUser.phone || "");

            if (token) {
                fetchOrders(token);
            }
        }
    }, []);

    const fetchOrders = async (token: string) => {
        try {
            const data = await api.getMyOrders(token);
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Not authenticated");

            const updatedData: any = { username, name, phone };
            if (password) updatedData.password = password;

            const updatedUser = await api.updateProfile(updatedData, token);

            localStorage.setItem("user", JSON.stringify(updatedUser));
            localStorage.setItem("token", updatedUser.token);

            setUser(updatedUser);
            setPassword("");
            toast.success("Profile updated successfully!");

            const userStr = localStorage.getItem("user");
            if (userStr) {
                const existingUser = JSON.parse(userStr);
                localStorage.setItem("user", JSON.stringify({ ...existingUser, ...updatedUser }));
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center text-muted-foreground">
                    Please log in to view profile.
                </div>
                <Footer />
            </div>
        );
    }

    const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none text-sm";
    const labelClass = "text-sm font-medium mb-1 block text-gray-800";

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="flex-grow pt-24 pb-12 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

                        {/* Left: Profile Form */}
                        <div className="lg:col-span-1">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <User className="h-8 w-8 text-primary" />
                                </div>
                                <h1 className="font-heading text-2xl text-gray-900">MY PROFILE</h1>
                                <p className="text-sm text-gray-500 mt-1">Manage your account details</p>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
                                <form onSubmit={handleUpdate} className="space-y-4">
                                    <div>
                                        <label className={labelClass}>Username / Email</label>
                                        <input
                                            required
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Full Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className={inputClass}
                                            placeholder="Your Name"
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Phone Number</label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className={inputClass}
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>
                                            New Password{" "}
                                            <span className="text-gray-400 font-normal">(Optional)</span>
                                        </label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className={inputClass}
                                            placeholder="Leave blank to keep current"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3 bg-primary text-primary-foreground font-heading text-sm tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 rounded"
                                    >
                                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                        {loading ? "UPDATING..." : "UPDATE PROFILE"}
                                    </button>
                                </form>

                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <button
                                        onClick={() => {
                                            localStorage.removeItem("token");
                                            localStorage.removeItem("user");
                                            navigate("/");
                                            window.dispatchEvent(new Event("storage"));
                                        }}
                                        className="flex items-center justify-center gap-2 w-full py-3 bg-red-50 border border-red-200 text-red-500 font-heading text-sm tracking-widest hover:bg-red-100 transition-colors rounded"
                                    >
                                        <LogOut className="h-4 w-4" /> LOGOUT
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right: Orders */}
                        <div className="lg:col-span-2">
                            <h2 className="font-heading text-xl text-gray-900 mb-6">MY ORDERS</h2>
                            <div className="space-y-4">
                                {orders.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {orders.map((order) => (
                                            <div
                                                key={order._id}
                                                className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm flex flex-col justify-between"
                                            >
                                                <div>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <span className="font-mono text-xs text-gray-400">
                                                                #{order._id.slice(-6).toUpperCase()}
                                                            </span>
                                                            <p className="text-sm font-medium text-gray-800">
                                                                {new Date(order.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-1">
                                                            <div
                                                                className={`px-2 py-1 rounded text-xs font-bold ${order.status === "Delivered"
                                                                    ? "bg-green-100 text-green-700"
                                                                    : order.status === "Cancelled"
                                                                        ? "bg-red-100 text-red-700"
                                                                        : "bg-yellow-100 text-yellow-700"
                                                                    }`}
                                                            >
                                                                {order.status.toUpperCase()}
                                                            </div>
                                                            <div className={`text-[10px] font-bold ${order.isPaid ? "text-green-600" : "text-amber-600"}`}>
                                                                {order.isPaid ? "● PAID" : "○ UNPAID"}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1 mb-3">
                                                        {order.orderItems.map((item: any, idx: number) => (
                                                            <div key={idx} className="flex justify-between text-xs">
                                                                <Link
                                                                    to={`/product/${item.product && (typeof item.product === 'string' ? item.product : (item.product.slug || ''))}`}
                                                                    className="text-gray-500 truncate max-w-[150px] hover:text-primary transition-colors"
                                                                >
                                                                    {item.name} x {item.qty}
                                                                </Link>
                                                                <span className="flex-shrink-0 text-gray-700">
                                                                    ₹{item.price.toLocaleString("en-IN")}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-2">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm text-gray-900">
                                                            ₹{order.totalPrice.toLocaleString("en-IN")}
                                                        </span>
                                                        <button
                                                            onClick={() => setSelectedOrder(order)}
                                                            className="text-[10px] text-primary font-bold hover:underline mt-0.5 uppercase tracking-wider text-left"
                                                        >
                                                            View Details
                                                        </button>
                                                    </div>
                                                    {order.status !== "Delivered" && order.status !== "Cancelled" && (
                                                        <button
                                                            onClick={async () => {
                                                                if (!confirm("Are you sure you want to cancel this order?")) return;
                                                                try {
                                                                    const token = localStorage.getItem("token");
                                                                    if (token) {
                                                                        await api.cancelOrder(order._id, token);
                                                                        toast.success("Order cancelled");
                                                                        fetchOrders(token);
                                                                    }
                                                                } catch (e) {
                                                                    toast.error("Failed to cancel");
                                                                }
                                                            }}
                                                            className="text-xs text-red-500 hover:underline"
                                                        >
                                                            Cancel Order
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 py-8 text-center bg-gray-50 rounded-lg border border-gray-200">
                                        No orders found.
                                    </p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="bg-surface-dark px-6 py-4 flex items-center justify-between border-b border-primary/10">
                            <h3 className="font-heading text-lg tracking-wider text-surface-dark-foreground uppercase">
                                Order <span className="text-primary text-sm font-mono ml-2 lowercase">#{selectedOrder._id.slice(-6).toUpperCase()}</span>
                            </h3>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-surface-dark-foreground/60 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Shipping Information</h4>
                                    <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded border border-gray-100">
                                        <p className="font-medium text-gray-900 mb-1">{user.name || user.username}</p>
                                        <p>{selectedOrder.shippingAddress.address}</p>
                                        <p>{selectedOrder.shippingAddress.city} - {selectedOrder.shippingAddress.postalCode}</p>
                                        <p>{selectedOrder.shippingAddress.country}</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Order Summary</h4>
                                    <div className="text-sm space-y-2 bg-gray-50 p-3 rounded border border-gray-100">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Date:</span>
                                            <span className="font-medium text-gray-900">{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Status:</span>
                                            <span className={`font-bold text-[10px] px-2 py-0.5 rounded ${selectedOrder.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{selectedOrder.status.toUpperCase()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Payment:</span>
                                            <span className={`font-bold text-[10px] ${selectedOrder.isPaid ? 'text-green-600' : 'text-amber-600'}`}>{selectedOrder.isPaid ? '● PAID' : '○ PENDING'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Order Items</h4>
                            <div className="space-y-4">
                                {selectedOrder.orderItems.map((item: any, idx: number) => (
                                    <div key={idx} className="flex gap-4 items-center bg-white p-3 border border-gray-100 rounded shadow-sm hover:border-primary/20 transition-colors">
                                        <div className="w-16 h-16 bg-muted rounded flex-shrink-0 overflow-hidden border border-gray-100 flex items-center justify-center">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                            ) : (
                                                <span className="text-2xl">📦</span>
                                            )}
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <Link
                                                to={`/product/${item.product && (typeof item.product === 'string' ? item.product : (item.product.slug || item.product.id || ''))}`}
                                                className="font-heading text-sm text-gray-900 hover:text-primary transition-colors truncate block"
                                                onClick={() => setSelectedOrder(null)}
                                            >
                                                {item.name.toUpperCase()}
                                            </Link>
                                            <p className="text-xs text-gray-500 mt-0.5">Quantity: {item.qty} × ₹{item.price.toLocaleString("en-IN")}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-sm text-gray-900">₹{(item.price * item.qty).toLocaleString("en-IN")}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Payable</span>
                            <span className="font-heading text-xl text-primary font-bold">₹{selectedOrder.totalPrice.toLocaleString("en-IN")}</span>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Profile;