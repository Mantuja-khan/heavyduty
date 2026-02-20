import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Checkout = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<"address" | "payment">("address");
    const [address, setAddress] = useState({
        address: "",
        city: "",
        postalCode: "",
        country: "India",
    });

    const { data: product, isLoading: isProductLoading } = useQuery({
        queryKey: ["product", slug],
        queryFn: () => (slug ? api.getProduct(slug) : null),
        enabled: !!slug,
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login to proceed with checkout");
            navigate("/auth");
        }
    }, [navigate]);

    const handleAddressSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep("payment");
    };

    const handlePayment = async () => {
        if (!product) return;
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please login to continue");
                return;
            }

            console.log("Creating order...");
            // 1. Create Order
            const orderData = {
                orderItems: [
                    {
                        name: product.name,
                        qty: 1,
                        image: product.image_url,
                        price: product.price,
                        product: product._id,
                    },
                ],
                shippingAddress: address,
                totalPrice: product.price,
            };

            const { order, razorpayOrder } = await api.createOrder(orderData, token);
            console.log("Order created:", order);
            console.log("Razorpay Order:", razorpayOrder);

            // 2. Open Razorpay
            const razorpayKey = await api.getRazorpayKey();
            console.log("Razorpay Key:", razorpayKey);

            if (!razorpayOrder || !razorpayOrder.id) {
                throw new Error("Invalid Razorpay Order ID");
            }

            const options = {
                key: razorpayKey,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: "Machinery Hub",
                description: `Purchase of ${product.name}`,
                order_id: razorpayOrder.id,
                handler: async function (response: any) {
                    console.log("Payment success:", response);
                    try {
                        // 3. Verify Payment
                        await api.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            order_id: order._id
                        }, token);

                        toast.success("Payment Successful! Order Placed.");
                        navigate("/profile"); // Redirect to profile/orders

                    } catch (error: any) {
                        console.error("Verification failed:", error);
                        toast.error(error.message || "Payment verification failed");
                    }
                },
                prefill: {
                    name: "User Name", // Ideally get from user profile
                    email: "user@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#F97316" // Orange-500
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();

            rzp.on('payment.failed', function (response: any) {
                console.error("Payment failed:", response);
                toast.error(`Payment Failed: ${response.error.description}`);
            });

        } catch (error: any) {
            console.error("Handle payment error:", error);
            toast.error(error.message || "Failed to initiate payment");
        } finally {
            setLoading(false);
        }
    };

    if (isProductLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
                    <Button onClick={() => navigate("/products")}>Back to Products</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <Navbar />
            <div className="flex-grow pt-24 pb-12 container mx-auto px-4 max-w-6xl">
                <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 pl-0 hover:pl-2 transition-all">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>

                <div className="grid md:grid-cols-12 gap-8">
                    {/* Left Column: Order Summary */}
                    <div className="md:col-span-8 space-y-6">
                        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">ORDER SUMMARY</h2>
                            <div className="flex gap-4">
                                {product.image_url ? (
                                    <img src={product.image_url} alt={product.name} className="w-24 h-24 object-contain border rounded-sm" />
                                ) : (
                                    <div className="w-24 h-24 bg-gray-100 flex items-center justify-center rounded-sm">
                                        <span className="text-2xl">📦</span>
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-medium text-lg text-gray-900">{product.name}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">{product.description}</p>
                                    <p className="text-xl font-bold text-gray-900 mt-2">₹{Number(product.price).toLocaleString("en-IN")}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center justify-between">
                                <span>SHIPPING ADDRESS</span>
                                {step === "payment" && (
                                    <Button variant="link" onClick={() => setStep("address")} className="text-primary h-auto p-0">Change</Button>
                                )}
                            </h2>

                            {step === "address" ? (
                                <form onSubmit={handleAddressSubmit} className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Address</label>
                                            <Input required value={address.address} onChange={e => setAddress({ ...address, address: e.target.value })} placeholder="Street Address / Flat No." className="bg-gray-50" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">City</label>
                                            <Input required value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} placeholder="City" className="bg-gray-50" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Postal Code</label>
                                            <Input required value={address.postalCode} onChange={e => setAddress({ ...address, postalCode: e.target.value })} placeholder="PIN Code" className="bg-gray-50" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Country</label>
                                            <Input disabled value={address.country} className="bg-gray-100" />
                                        </div>
                                    </div>
                                    <div className="flex justify-end mt-4">
                                        <Button type="submit" className="bg-[#fb641b] hover:bg-[#fb641b]/90 text-white font-bold px-8">
                                            DELIVER HERE
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="text-sm text-gray-700">
                                    <p className="font-medium">{address.address}</p>
                                    <p>{address.city} - {address.postalCode}</p>
                                    <p>{address.country}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Price Details & Payment */}
                    <div className="md:col-span-4 space-y-6">
                        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200">
                            <h2 className="text-lg font-bold text-gray-400 mb-4 border-b pb-2">PRICE DETAILS</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span>Price (1 item)</span>
                                    <span>₹{Number(product.price).toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span>- ₹0</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery Charges</span>
                                    <span className="text-green-600">FREE</span>
                                </div>
                                <div className="border-t border-dashed my-2"></div>
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total Amount</span>
                                    <span>₹{Number(product.price).toLocaleString("en-IN")}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200">
                            <div className="flex items-center gap-2 mb-4 text-green-700 font-medium text-sm">
                                <ShieldCheck className="w-5 h-5" />
                                Safe and Secure Payments. 100% Authentic products.
                            </div>
                            <Button
                                onClick={handlePayment}
                                disabled={loading || step === "address"}
                                className="w-full bg-[#fb641b] hover:bg-[#fb641b]/90 text-white font-bold py-6 text-lg shadow-sm"
                            >
                                {loading ? <Loader2 className="animate-spin mr-2" /> : "PAYMENT"}
                            </Button>
                            {step === "address" && (
                                <p className="text-xs text-red-500 text-center mt-2">Please save delivery address first</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Checkout;
