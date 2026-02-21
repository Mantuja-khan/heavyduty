import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { X, User, Mail, Phone, MapPin, Package, CreditCard, Calendar, ShoppingBag } from "lucide-react";

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const data = await api.getAllOrders(token);
          setOrders(data);
        } else {
          navigate("/auth");
          toast.error("Please login as an admin");
        }
      } catch (error: any) {
        console.error("Failed to fetch orders:", error);
        if (error.message.includes("401")) {
          toast.error("Your session has expired or you are not authorized as an admin. Please login again.");
          navigate("/auth");
        } else {
          toast.error(error.message || "Failed to load orders.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await api.updateOrderStatus(orderId, newStatus, token);
      toast.success("Order status updated");
      // Refresh orders
      const data = await api.getAllOrders(token);
      setOrders(data);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div>
      <h1 className="font-heading text-2xl text-foreground mb-6">ORDERS</h1>
      <div className="bg-card border border-border overflow-x-auto rounded-md shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left bg-muted/30">
              <th className="px-5 py-3 font-heading text-xs tracking-wider text-muted-foreground whitespace-nowrap">ORDER ID</th>
              <th className="px-5 py-3 font-heading text-xs tracking-wider text-muted-foreground">CUSTOMER</th>
              <th className="px-5 py-3 font-heading text-xs tracking-wider text-muted-foreground">PRODUCT</th>
              <th className="px-5 py-3 font-heading text-xs tracking-wider text-muted-foreground">AMOUNT</th>
              <th className="px-5 py-3 font-heading text-xs tracking-wider text-muted-foreground">PAYMENT</th>
              <th className="px-5 py-3 font-heading text-xs tracking-wider text-muted-foreground">STATUS</th>
              <th className="px-5 py-3 font-heading text-xs tracking-wider text-muted-foreground text-right">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-b border-border last:border-0 hover:bg-muted/50">
                <td className="px-5 py-3 font-mono text-xs text-muted-foreground">#{o._id.slice(-6).toUpperCase()}</td>
                <td className="px-5 py-3">
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{o.customerName || o.user?.username || 'Guest'}</span>
                    <span className="text-[10px] text-muted-foreground">{o.customerEmail || o.user?.username || 'N/A'}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-muted-foreground max-w-[200px] truncate">
                  {o.orderItems.map((item: any) => item.name).join(", ")}
                </td>
                <td className="px-5 py-3 font-heading text-foreground">₹{o.totalPrice.toLocaleString("en-IN")}</td>
                <td className="px-5 py-3 text-xs">
                  <span className={`px-2 py-0.5 font-heading tracking-wider rounded border ${o.isPaid ? "bg-green-100 text-green-700 border-green-200" : "bg-yellow-100 text-yellow-700 border-yellow-200"
                    }`}>{o.isPaid ? "PAID" : "PENDING"}</span>
                </td>
                <td className="px-5 py-3">
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o._id, e.target.value)}
                    className={`text-[10px] font-heading tracking-wider rounded border px-2 py-1 bg-transparent focus:outline-none ${o.status === "Delivered" ? "text-green-700 border-green-200 bg-green-50" :
                      o.status === "Cancelled" ? "text-red-700 border-red-200 bg-red-50" :
                        o.status === "Shipped" ? "text-blue-700 border-blue-200 bg-blue-50" :
                          "text-yellow-700 border-yellow-200 bg-yellow-50"
                      }`}
                  >
                    <option value="Processing">PROCESSING</option>
                    <option value="Shipped">SHIPPED</option>
                    <option value="Delivered">DELIVERED</option>
                    <option value="Cancelled">CANCELLED</option>
                  </select>
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => setSelectedOrder(o)}
                    className="text-[10px] font-bold text-primary hover:text-primary/70 border border-primary/20 px-2 py-1 rounded"
                  >
                    VIEW DETAILS
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-12 text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl">📦</span>
                    <p>No orders found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Admin Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  Order Detail
                </h2>
                <p className="text-xs text-gray-500 font-mono mt-0.5">ID: #{selectedOrder._id}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Customer & Shipping Info */}
                <div className="space-y-6">
                  <section>
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      CUSTOMER INFORMATION
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase font-bold">Full Name</p>
                          <p className="text-sm font-medium">{selectedOrder.customerName || selectedOrder.user?.username || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase font-bold">Email Address</p>
                          <p className="text-sm font-medium">{selectedOrder.customerEmail || selectedOrder.user?.username || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase font-bold">Phone Number</p>
                          <p className="text-sm font-medium">{selectedOrder.customerPhone || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      SHIPPING ADDRESS
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm leading-relaxed">
                        {selectedOrder.shippingAddress.address}<br />
                        {selectedOrder.shippingAddress.city} - {selectedOrder.shippingAddress.postalCode}<br />
                        {selectedOrder.shippingAddress.country}
                      </p>
                    </div>
                  </section>
                </div>

                {/* Order Summary & Status */}
                <div className="space-y-6">
                  <section>
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Package className="w-4 h-4 text-primary" />
                      ORDER STATUS
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 font-bold uppercase">Payment Status</span>
                        <span className={`px-2 py-1 text-[10px] font-bold rounded ${selectedOrder.isPaid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {selectedOrder.isPaid ? 'PAID' : 'PENDING'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 font-bold uppercase">Order Status</span>
                        <select
                          value={selectedOrder.status}
                          onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                          className={`text-[10px] font-bold rounded border px-3 py-1 bg-white focus:outline-none ${selectedOrder.status === "Delivered" ? "text-green-700 border-green-200" :
                            selectedOrder.status === "Cancelled" ? "text-red-700 border-red-200" :
                              selectedOrder.status === "Shipped" ? "text-blue-700 border-blue-200" :
                                "text-yellow-700 border-yellow-200"
                            }`}
                        >
                          <option value="Processing">PROCESSING</option>
                          <option value="Shipped">SHIPPED</option>
                          <option value="Delivered">DELIVERED</option>
                          <option value="Cancelled">CANCELLED</option>
                        </select>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 font-bold uppercase">Order Date</span>
                        <span className="text-sm font-medium">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-primary" />
                      PAYMENT DETAILS
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      {selectedOrder.paymentResult?.id && (
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Transaction ID:</span>
                          <span className="font-mono font-medium">{selectedOrder.paymentResult.id}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                        <span>Total Amount:</span>
                        <span className="text-primary">₹{selectedOrder.totalPrice.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </section>
                </div>
              </div>

              {/* Items List */}
              <section className="mt-8">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-primary" />
                  ORDERED ITEMS
                </h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr className="text-left text-[10px] font-bold text-gray-500 uppercase">
                        <th className="px-4 py-3">Product</th>
                        <th className="px-4 py-3 text-center">Qty</th>
                        <th className="px-4 py-3 text-right">Price</th>
                        <th className="px-4 py-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedOrder.orderItems.map((item: any) => (
                        <tr key={item._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img src={item.image} alt={item.name} className="w-12 h-12 object-contain border rounded bg-white p-1" />
                              <Link to={`/product/${item.product}`} className="font-medium text-gray-900 hover:text-primary transition-colors">
                                {item.name}
                              </Link>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">{item.qty}</td>
                          <td className="px-4 py-3 text-right">₹{item.price.toLocaleString("en-IN")}</td>
                          <td className="px-4 py-3 text-right font-bold">₹{(item.qty * item.price).toLocaleString("en-IN")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* Modal Footer */}
            <div className="border-t px-6 py-4 flex justify-end gap-3 bg-gray-50">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
