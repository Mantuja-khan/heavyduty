import { useEffect, useState } from "react";
import { api } from "@/services/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const data = await api.getAllOrders(token);
          setOrders(data);
        }
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="font-heading text-2xl text-foreground mb-6">ORDERS</h1>
      <div className="bg-card border border-border overflow-x-auto rounded-md shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left bg-muted/30">
              <th className="px-5 py-3 font-heading text-xs tracking-wider text-muted-foreground">ORDER ID</th>
              <th className="px-5 py-3 font-heading text-xs tracking-wider text-muted-foreground">USER</th>
              <th className="px-5 py-3 font-heading text-xs tracking-wider text-muted-foreground">PRODUCT</th>
              <th className="px-5 py-3 font-heading text-xs tracking-wider text-muted-foreground">AMOUNT</th>
              <th className="px-5 py-3 font-heading text-xs tracking-wider text-muted-foreground">PAYMENT</th>
              <th className="px-5 py-3 font-heading text-xs tracking-wider text-muted-foreground">STATUS</th>
              <th className="px-5 py-3 font-heading text-xs tracking-wider text-muted-foreground">DATE</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-b border-border last:border-0 hover:bg-muted/50">
                <td className="px-5 py-3 font-mono text-xs">{o._id.slice(-6).toUpperCase()}</td>
                <td className="px-5 py-3 font-medium">{o.user?.username || 'Unknown'}</td>
                <td className="px-5 py-3 text-muted-foreground">
                  {o.orderItems.map((item: any) => item.name).join(", ")}
                </td>
                <td className="px-5 py-3 font-heading">₹{o.totalPrice.toLocaleString("en-IN")}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-1 text-xs font-heading tracking-wider rounded border ${o.isPaid ? "bg-green-100 text-green-700 border-green-200" : "bg-yellow-100 text-yellow-700 border-yellow-200"
                    }`}>{o.isPaid ? "PAID" : "PENDING"}</span>
                </td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-1 text-xs font-heading tracking-wider rounded border ${o.status === "Delivered" ? "bg-green-100 text-green-700 border-green-200" :
                      o.status === "Cancelled" ? "bg-red-100 text-red-700 border-red-200" :
                        o.status === "Shipped" ? "bg-blue-100 text-blue-700 border-blue-200" :
                          "bg-yellow-100 text-yellow-700 border-yellow-200"
                    }`}>{o.status.toUpperCase()}</span>
                </td>
                <td className="px-5 py-3 text-muted-foreground text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-muted-foreground">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
