const API_URL = '/api';

export const api = {
    // Auth
    login: async (credentials: any) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }
        return response.json();
    },

    register: async (credentials: any) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
        }
        return response.json();
    },

    sendOtp: async (email: string) => {
        const response = await fetch(`${API_URL}/auth/send-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to send OTP");
        }
        return response.json();
    },

    verifySignup: async (data: any) => {
        const response = await fetch(`${API_URL}/auth/verify-signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Signup failed");
        }
        return response.json();
    },

    updateProfile: async (data: any, token: string) => {
        const response = await fetch(`${API_URL}/auth/profile`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Profile update failed");
        }
        return response.json();
    },

    submitCareer: async (formData: FormData) => {
        try {
            console.log("Submitting career application...");
            const response = await fetch(`${API_URL}/career/apply`, {
                method: 'POST',
                body: formData, // Content-Type is set automatically for FormData
            });
            console.log("Career response status:", response.status);
            if (!response.ok) {
                const error = await response.json();
                console.error("Career submission error:", error);
                throw new Error(error.message || 'Application failed');
            }
            return response.json();
        } catch (error) {
            console.error("Error in submitCareer:", error);
            throw error;
        }
    },


    // Products
    getProducts: async () => {
        try {
            console.log("Fetching products from API...");
            const response = await fetch(`${API_URL}/products`);
            console.log("Products response status:", response.status);
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            console.log("Products fetched:", data);
            return data;
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    },


    getProduct: async (slug: string) => {
        const response = await fetch(`${API_URL}/products/${slug}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        return response.json();
    },

    createProduct: async (productData: any, token: string) => {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(productData),
        });
        if (!response.ok) throw new Error('Failed to create product');
        return response.json();
    },

    updateProduct: async (id: string, productData: any, token: string) => {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(productData),
        });
        if (!response.ok) throw new Error('Failed to update product');
        return response.json();
    },

    deleteProduct: async (id: string, token: string) => {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('Failed to delete product');
        return response.json();
    },

    // Reviews
    getProductReviews: async (productId: string) => {
        const response = await fetch(`${API_URL}/products/${productId}/reviews`);
        if (!response.ok) throw new Error('Failed to fetch reviews');
        return response.json();
    },

    addProductReview: async (id: string, data: any, token: string) => {
        const response = await fetch(`${API_URL}/products/${id}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to add review');
        return response.json();
    },
         updateProductReview: async (
        productId: string,
        reviewId: string,
        data: any,
        token: string
    ) => {
        const response = await fetch(
            `${API_URL}/products/${productId}/reviews/${reviewId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update review');
        }

        return response.json();
    },

    deleteReview: async (productId: string, reviewId: string, token: string) => {
        const response = await fetch(`${API_URL}/products/${productId}/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('Failed to delete review');
        return response.json();
    },

    // Blogs
    getBlogs: async () => {
        const response = await fetch(`${API_URL}/blogs`);
        if (!response.ok) throw new Error('Failed to fetch blogs');
        return response.json();
    },

    getBlog: async (slug: string) => {
        const response = await fetch(`${API_URL}/blogs/${slug}`);
        if (!response.ok) throw new Error('Failed to fetch blog');
        return response.json();
    },

    createBlog: async (blogData: any, token: string) => {
        const response = await fetch(`${API_URL}/blogs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(blogData),
        });
        if (!response.ok) throw new Error('Failed to create blog');
        return response.json();
    },

    updateBlog: async (id: string, blogData: any, token: string) => {
        const response = await fetch(`${API_URL}/blogs/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(blogData),
        });
        if (!response.ok) throw new Error('Failed to update blog');
        return response.json();
    },

    deleteBlog: async (id: string, token: string) => {
        const response = await fetch(`${API_URL}/blogs/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('Failed to delete blog');
        return response.json();
    },

    // Orders
    createOrder: async (orderData: any, token: string) => {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(orderData),
        });
        if (!response.ok) throw new Error('Failed to create order');
        return response.json();
    },

    verifyPayment: async (paymentResult: any, token: string) => {
        const response = await fetch(`${API_URL}/orders/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(paymentResult),
        });
        if (!response.ok) throw new Error('Payment verification failed');
        return response.json();
    },

    getMyOrders: async (token: string) => {
        const response = await fetch(`${API_URL}/orders/myorders`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('Failed to fetch orders');
        return response.json();
    },

    cancelOrder: async (id: string, token: string) => {
        const response = await fetch(`${API_URL}/orders/${id}/cancel`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('Failed to cancel order');
        return response.json();
    },

    getAllOrders: async (token: string) => {
        const response = await fetch(`${API_URL}/orders`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('Failed to fetch orders');
        return response.json();
    },

    // Config


    getRazorpayKey: async () => {
        const response = await fetch(`${API_URL}/config/razorpay`);
        if (!response.ok) throw new Error('Failed to fetch razorpay key');
        return response.text(); // Returns string
    },

    // Enquiries
    createEnquiry: async (enquiryData: any) => {
        const response = await fetch(`${API_URL}/enquiries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(enquiryData),
        });
        if (!response.ok) throw new Error('Failed to submit enquiry');
        return response.json();
    },

    getEnquiries: async (token: string) => {
        const response = await fetch(`${API_URL}/enquiries`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch enquiries');
        }
        return response.json();
    },

    updateEnquiryStatus: async (id: string, status: string, token: string) => {
        const response = await fetch(`${API_URL}/enquiries/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status }),
        });
        if (!response.ok) throw new Error('Failed to update enquiry status');
        return response.json();
    },

    deleteEnquiry: async (id: string, token: string) => {
        const response = await fetch(`${API_URL}/enquiries/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('Failed to delete enquiry');
        return response.json();
    }
};

