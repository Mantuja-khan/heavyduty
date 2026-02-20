import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { toast } from "sonner";
import { Package, Eye } from "lucide-react";
import InquiryViewModal from "@/components/admin/InquiryViewModal";
import { useNavigate } from "react-router-dom";

const AdminInquiries = () => {
  const [inquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const navigate = useNavigate();

  const fetchEnquiries = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth");
        return;
      }
      const data = await api.getEnquiries(token);
      setEnquiries(data);
    } catch (error: any) {
      console.error("Fetch enquires error:", error);
      if (error.message && (error.message.includes("Not authorized") || error.message.includes("token failed") || error.message.includes("jwt"))) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/auth");
      } else {
        toast.error(error.message || "Failed to fetch inquiries");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await api.updateEnquiryStatus(id, newStatus, token);
      toast.success("Status updated");
      fetchEnquiries();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="font-heading text-2xl text-foreground mb-6">INQUIRIES</h1>
      <div className="bg-card border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-5 py-3 font-heading text-xs tracking-wider text-muted-foreground">NAME</th>
              <th className="px-5 py-3 font-heading text-xs tracking-wider text-muted-foreground">COMPANY</th>
              <th className="px-5 py-3 font-heading text-xs tracking-wider text-muted-foreground">PRODUCT</th>
              <th className="px-5 py-3 font-heading text-xs tracking-wider text-muted-foreground">CONTACT</th>
              <th className="px-5 py-3 font-heading text-xs tracking-wider text-muted-foreground">STATUS</th>
              <th className="px-5 py-3 font-heading text-xs tracking-wider text-muted-foreground">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inq: any) => (
              <tr key={inq._id} className="border-b border-border last:border-0 hover:bg-muted/50">
                <td className="px-5 py-3 font-medium">{inq.name}</td>
                <td className="px-5 py-3 text-muted-foreground">{inq.company || "-"}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    {inq.productImage ? (
                      <img src={inq.productImage} alt={inq.product} className="w-8 h-8 object-cover rounded" />
                    ) : (
                      <Package className="w-8 h-8 text-muted-foreground p-1 bg-muted rounded" />
                    )}
                    <span className="text-xs">{inq.product}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-xs text-muted-foreground">
                  {inq.email}<br />{inq.phone}
                </td>
                <td className="px-5 py-3">
                  <select
                    value={inq.status}
                    onChange={(e) => handleStatusUpdate(inq._id, e.target.value)}
                    className={`bg-transparent border rounded p-1 text-xs font-heading tracking-wider ${inq.status === "New" ? "text-primary border-primary/30" :
                      inq.status === "Contacted" ? "text-blue-700 border-blue-200" :
                        "text-muted-foreground border-border"
                      }`}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Closed">Closed</option>
                  </select>
                </td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => setSelectedInquiry(inq)}
                    className="p-1.5 hover:bg-primary/10 text-primary rounded transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {inquiries.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-muted-foreground">No inquiries found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedInquiry && (
        <InquiryViewModal
          data={selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
        />
      )}
    </div>
  );
};

export default AdminInquiries;
