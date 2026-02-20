import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HardHat } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Optionally verify token with backend /me endpoint
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await api.login({ username, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      toast.success("Welcome back, Admin!");
      navigate("/admin/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <HardHat className="h-12 w-12 text-primary mx-auto mb-3" />
          <h1 className="font-heading text-2xl text-surface-dark-foreground">ADMIN <span className="text-primary">LOGIN</span></h1>
          <p className="text-sm text-muted-foreground mt-1">HeavyBuild Pro Management</p>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input required type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-3 bg-surface-dark border border-primary/20 text-sm text-surface-dark-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
          <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-surface-dark border border-primary/20 text-sm text-surface-dark-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
          <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-primary-foreground font-heading text-sm tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50">
            {loading ? "LOGGING IN..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
