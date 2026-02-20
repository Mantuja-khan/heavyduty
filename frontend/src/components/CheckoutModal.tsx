import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { api } from "@/services/api";
import type { Product } from "@/hooks/useProducts";

interface Props {
    product: Product;
    onClose: () => void;
    onSuccess: () => void;
}

const CheckoutModal = ({ product, onClose, onSuccess }: Props) => {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<"address" | "payment">("address");
    const [address, setAddress] = useState({
        address: "",
        city: "",
        postalCode: "",
        country: "India",
    });

    const handleAddressSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep("payment");
    };

    const handlePayment = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please login to continue");
                return;
            }

            // 1. Create Order
            const orderData = {
                orderItems: [
                    {
                        name: product.name,
                        qty: 1,
                        image: product.image_url,
                        price: product.price,
                        product: product.id,

                    },
                ],
                shippingAddress: address,
                totalPrice: product.price,
            };

            const { order, razorpayOrder } = await api.createOrder(orderData, token);

            // 2. Open Razorpay
            const razorpayKey = await api.getRazorpayKey();

            const options = {
                key: razorpayKey,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: "Machinery Hub",
                description: `Purchase of ${product.name}`,
                order_id: razorpayOrder.id,
                handler: async function (response: any) {
                    try {
                        // 3. Verify Payment
                        await api.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            order_id: order._id
                        }, token);

                        toast.success("Payment Successful!");
                        onSuccess();
                        onClose();

                    } catch (error: any) {
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
                toast.error(`Payment Failed: ${response.error.description}`);
            });

        } catch (error: any) {
            toast.error(error.message || "Failed to initiate payment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="font-heading text-lg">CHECKOUT</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-black">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex items-center gap-4 mb-6 p-3 bg-gray-50 rounded border">
                        {product.image_url && <img src={product.image_url} alt="" className="w-12 h-12 object-cover rounded" />}
                        <div>
                            <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                            <p className="font-bold text-lg text-primary">₹{Number(product.price).toLocaleString("en-IN")}</p>
                        </div>
                    </div>

                    {step === "address" ? (
                        <form onSubmit={handleAddressSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Address</label>
                                <Input required value={address.address} onChange={e => setAddress({ ...address, address: e.target.value })} placeholder="Street Address" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">City</label>
                                    <Input required value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} placeholder="City" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Postal Code</label>
                                    <Input required value={address.postalCode} onChange={e => setAddress({ ...address, postalCode: e.target.value })} placeholder="ZIP Code" />
                                </div>
                            </div>
                            <Button type="submit" className="w-full">Continue to Payment</Button>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div className="border p-4 rounded text-sm space-y-1">
                                <p className="font-bold">Shipping To:</p>
                                <p>{address.address}, {address.city}, {address.country}</p>
                            </div>
                            <Button onClick={handlePayment} disabled={loading} className="w-full py-6 text-lg">
                                {loading ? <Loader2 className="animate-spin mr-2" /> : "PAY NOW"}
                            </Button>
                            <button onClick={() => setStep("address")} className="text-xs text-center w-full text-gray-500 hover:underline">Change Address</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;
