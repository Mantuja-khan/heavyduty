import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const LoadingBar = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 600); // Animation duration

        return () => clearTimeout(timer);
    }, [location.pathname, location.search]);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    key="loading-bar"
                    initial={{ width: "0%", opacity: 1 }}
                    animate={{ width: "100%" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed top-0 left-0 h-1 bg-primary z-[9999]"
                />
            )}
        </AnimatePresence>
    );
};

export default LoadingBar;
