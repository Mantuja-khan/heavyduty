import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { HardHat, LayoutDashboard, Package, MessageSquare, ShoppingCart, LogOut } from "lucide-react";


const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/blog", label: "Blog", icon: MessageSquare },
  { to: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    // Auth is now handled by AdminRoute.tsx
    setIsAdmin(true);
  }, []);

  if (isAdmin === null) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin");
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 bg-surface-dark flex flex-col shrink-0">
        <div className="flex items-center gap-2 px-5 h-16 border-b border-primary/10">
          <HardHat className="h-6 w-6 text-primary" />
          <span className="font-heading text-sm tracking-wider text-surface-dark-foreground">
            HB <span className="text-primary">ADMIN</span>
          </span>
        </div>
        <nav className="flex-1 py-4 flex flex-col gap-1 px-3">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-sm font-heading tracking-wider transition-colors ${isActive
                  ? "bg-primary/10 text-primary"
                  : "text-surface-dark-foreground/70 hover:text-surface-dark-foreground hover:bg-surface-dark/50"
                }`
              }
            >
              <l.icon className="h-4 w-4" />
              {l.label.toUpperCase()}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-6 py-4 text-sm font-heading tracking-wider text-muted-foreground hover:text-destructive transition-colors border-t border-primary/10"
        >
          <LogOut className="h-4 w-4" /> LOGOUT
        </button>
      </aside>
      <main className="flex-1 bg-background overflow-y-auto">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
