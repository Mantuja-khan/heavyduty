import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, HardHat, User, LogOut, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "@/hooks/useProducts";


const navLinks = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/blog", label: "Blog" },
  { to: "/career", label: "Career" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: products = [] } = useProducts();
  const [user, setUser] = useState<any>(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
      setOpen(false);
    }
  };

  const filteredProducts = searchQuery.trim().length > 1
    ? products.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5)
    : [];

  useEffect(() => {
    const checkUser = () => {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        setUser(JSON.parse(userStr));
      } else {
        setUser(null);
      }
    };

    checkUser();

    // Listen for storage events to update state across tabs or after login
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-dark/95 backdrop-blur-md border-b border-primary/20">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <HardHat className="h-8 w-8 text-primary" />
          <span className="font-heading text-xl text-surface-dark-foreground tracking-wider">
            HEAVYBUILD <span className="text-primary">PRO</span>
          </span>
        </Link>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-surface-dark/50 border border-primary/20 rounded px-4 py-1.5 text-sm text-surface-dark-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
              <Search className="h-4 w-4" />
            </button>
          </form>

          {/* Search Dropdown - Desktop */}
          <AnimatePresence>
            {searchQuery.trim().length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-12 left-0 right-0 bg-surface-dark border border-primary/20 rounded shadow-2xl z-50 overflow-hidden"
              >
                <div className="max-h-80 overflow-y-auto">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                      <button
                        key={product.id}
                        onClick={() => {
                          navigate(`/product/${product.slug}`);
                          setSearchQuery("");
                        }}
                        className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0"
                      >
                        <div className="h-10 w-10 flex-shrink-0 bg-muted/20 rounded overflow-hidden">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-primary/10">
                              <HardHat className="h-4 w-4 text-primary" />
                            </div>
                          )}
                        </div>
                        <div className="flex-grow overflow-hidden">
                          <p className="text-sm font-medium text-surface-dark-foreground truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground uppercase">{product.category}</p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-sm text-muted-foreground uppercase tracking-widest">Product not found</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`font-heading text-sm tracking-widest transition-colors hover:text-primary ${pathname === l.to ? "text-primary" : "text-surface-dark-foreground"
                }`}
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="font-heading text-sm text-surface-dark-foreground hover:text-primary transition-colors flex items-center gap-2">
                <User className="h-4 w-4" /> PROFILE
              </Link>
            </div>
          ) : (
            <Link
              to="/auth"
              className="ml-2 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-heading text-sm tracking-wider hover:bg-primary/90 transition-colors"
            >
              <User className="h-4 w-4" /> SIGN IN
            </Link>
          )}
        </div>

        {/* Mobile buttons */}
        <div className="flex items-center gap-4 md:hidden">
          <button className="text-surface-dark-foreground" onClick={() => setSearchOpen(!searchOpen)}>
            <Search className="h-6 w-6" />
          </button>
          <button className="text-surface-dark-foreground" onClick={() => setOpen(!open)}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-surface-dark border-t border-primary/20 p-4"
          >
            <form onSubmit={handleSearch} className="relative">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-background border border-primary/20 rounded px-4 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-primary">
                <Search className="h-5 w-5" />
              </button>
            </form>

            {/* Mobile search results */}
            {searchQuery.trim().length > 1 && (
              <div className="mt-4 border-t border-white/5 pt-2 max-h-60 overflow-y-auto">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => (
                    <button
                      key={product.id}
                      onClick={() => {
                        navigate(`/product/${product.slug}`);
                        setSearchQuery("");
                        setSearchOpen(false);
                        setOpen(false);
                      }}
                      className="w-full flex items-center gap-3 py-3 border-b border-white/5 last:border-0"
                    >
                      <div className="h-10 w-10 flex-shrink-0 bg-muted/20 rounded overflow-hidden">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-primary/10">
                            <HardHat className="h-4 w-4 text-primary" />
                          </div>
                        )}
                      </div>
                      <div className="flex-grow overflow-hidden text-left">
                        <p className="text-sm font-medium text-surface-dark-foreground truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground uppercase">{product.category}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">Product not found</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-surface-dark border-t border-primary/20 overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-4">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`font-heading tracking-widest text-sm ${pathname === l.to ? "text-primary" : "text-surface-dark-foreground"
                    }`}
                >
                  {l.label}
                </Link>
              ))}
              {user ? (
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 border border-primary/20 text-surface-dark-foreground font-heading text-sm tracking-wider text-center"
                >
                  <User className="h-4 w-4" /> PROFILE
                </Link>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-heading text-sm tracking-wider text-center"
                >
                  <User className="h-4 w-4" /> SIGN IN
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
