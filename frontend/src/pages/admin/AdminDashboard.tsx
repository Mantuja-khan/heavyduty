import { Package, MessageSquare, ShoppingCart, DollarSign } from "lucide-react";
import { allProducts } from "@/data/products";

const stats = [
  { label: "Total Products", value: allProducts.length, icon: Package, color: "text-primary" },
  { label: "Total Inquiries", value: 24, icon: MessageSquare, color: "text-blue-500" },
  { label: "Total Orders", value: 12, icon: ShoppingCart, color: "text-green-500" },
  { label: "Revenue", value: "₹18.5L", icon: DollarSign, color: "text-primary" },
];

const recentOrders = [
  { id: "ORD-001", customer: "Raj Construction", product: "HB-200 Concrete Mixer", amount: "₹2,85,000", status: "Paid" },
  { id: "ORD-002", customer: "Sharma Builders", product: "HB-500 Plate Compactor", amount: "₹1,45,000", status: "Shipped" },
  { id: "ORD-003", customer: "Metro Infra", product: "HB-3T Tower Hoist", amount: "₹5,20,000", status: "Pending" },
];

const AdminDashboard = () => (
  <div>
    <h1 className="font-heading text-2xl text-foreground mb-6">DASHBOARD</h1>

    {/* Stats */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((s) => (
        <div key={s.label} className="bg-card border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <s.icon className={`h-6 w-6 ${s.color}`} />
          </div>
          <p className="font-heading text-2xl text-foreground">{s.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
        </div>
      ))}
    </div>

    {/* Recent Orders */}
    <div className="bg-card border border-border">
      <div className="p-5 border-b border-border">
        <h2 className="font-heading text-sm tracking-widest text-foreground">RECENT ORDERS</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-5 py-3 font-heading text-xs tracking-wider text-muted-foreground">ORDER ID</th>
              <th className="px-5 py-3 font-heading text-xs tracking-wider text-muted-foreground">CUSTOMER</th>
              <th className="px-5 py-3 font-heading text-xs tracking-wider text-muted-foreground">PRODUCT</th>
              <th className="px-5 py-3 font-heading text-xs tracking-wider text-muted-foreground">AMOUNT</th>
              <th className="px-5 py-3 font-heading text-xs tracking-wider text-muted-foreground">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((o) => (
              <tr key={o.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3 font-mono text-xs">{o.id}</td>
                <td className="px-5 py-3">{o.customer}</td>
                <td className="px-5 py-3 text-muted-foreground">{o.product}</td>
                <td className="px-5 py-3 font-heading">{o.amount}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-1 text-xs font-heading tracking-wider ${
                    o.status === "Paid" ? "bg-green-100 text-green-700" :
                    o.status === "Shipped" ? "bg-blue-100 text-blue-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>{o.status.toUpperCase()}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
