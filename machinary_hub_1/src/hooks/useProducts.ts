import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: "Trading" | "Manufacturing";
  description: string;
  specifications: Record<string, string>;
  price: number | null;
  image_url: string | null;
  stock: number;
  featured: boolean;

  // 🔥 Added (already backend me add kiya tha)
  rating?: number;
  numReviews?: number;

  created_at: string;
  updated_at: string;
}

const fetchProducts = async (): Promise<Product[]> => {
  const data = await api.getProducts();
  return data.map((p: any) => ({
    ...p,
    category: p.category as "Trading" | "Manufacturing",
    specifications: p.specifications ?? {},
  }));
};

export const useProducts = () =>
  useQuery({ queryKey: ["products"], queryFn: fetchProducts });

export const useFeaturedProducts = () =>
  useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      const data = await api.getProducts();
      return data
        .filter((p: any) => p.featured)
        .slice(0, 6)
        .map((p: any) => ({
          ...p,
          category: p.category as "Trading" | "Manufacturing",
          specifications: p.specifications ?? {},
        }));
    },
  });


// ================= REVIEWS =================

export const useReviews = (productId: string) =>
  useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => api.getProductReviews(productId),
    enabled: !!productId,
  });

export const useAddReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: any }) => {
      const token = localStorage.getItem("token");
      return api.addProductReview(productId, data, token || "");
    },
    onSuccess: (_, { productId }) => {
      // 🔥 Refresh reviews
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });

      // 🔥 Refresh product (rating update ke liye)
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, reviewId }: { productId: string; reviewId: string }) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");
      return api.deleteReview(productId, reviewId, token);
    },
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
// 🔥 NEW — UPDATE REVIEW SUPPORT

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      reviewId,
      data,
    }: {
      productId: string;
      reviewId: string;
      data: any;
    }) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      return api.updateProductReview(productId, reviewId, data, token);
    },
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
