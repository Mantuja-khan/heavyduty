import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Plus, Trash2, Edit2, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface BlogForm {
    title: string;
    content: string;
    image_url: string;
    published: boolean;
}

const AdminBlog = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<BlogForm>({
        title: "",
        content: "",
        image_url: "",
        published: true,
    });

    const queryClient = useQueryClient();

    const { data: blogs, isLoading } = useQuery({
        queryKey: ["admin-blogs"],
        queryFn: api.getBlogs,
    });

    const createMutation = useMutation({
        mutationFn: (data: BlogForm) => api.createBlog(data, localStorage.getItem("token") || ""),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
            setIsOpen(false);
            resetForm();
            toast.success("Blog post created successfully");
        },
        onError: (error: Error) => toast.error(error.message),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: BlogForm }) =>
            api.updateBlog(id, data, localStorage.getItem("token") || ""),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
            setIsOpen(false);
            resetForm();
            toast.success("Blog post updated successfully");
        },
        onError: (error: Error) => toast.error(error.message),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.deleteBlog(id, localStorage.getItem("token") || ""),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
            toast.success("Blog post deleted");
        },
        onError: (error: Error) => toast.error(error.message),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            updateMutation.mutate({ id: editingId, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const handleEdit = (blog: any) => {
        setEditingId(blog.id);
        setFormData({
            title: blog.title,
            content: blog.content,
            image_url: blog.image_url || "",
            published: blog.published,
        });
        setIsOpen(true);
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({ title: "", content: "", image_url: "", published: true });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="font-heading text-2xl text-foreground">Blog Management</h1>
                    <p className="text-muted-foreground text-sm">Manage your news and articles</p>
                </div>
                <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
                    <DialogTrigger asChild>
                        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 font-heading text-sm tracking-wider hover:bg-primary/90 transition-colors">
                            <Plus className="h-4 w-4" /> NEW POST
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{editingId ? "Edit Post" : "Create New Post"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Title</label>
                                <input
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 bg-background border rounded-md"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Image URL</label>
                                <input
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    className="w-full px-3 py-2 bg-background border rounded-md"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Content</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full px-3 py-2 bg-background border rounded-md resize-none"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.published}
                                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                    id="published"
                                />
                                <label htmlFor="published" className="text-sm">Published</label>
                            </div>
                            <button
                                type="submit"
                                disabled={createMutation.isPending || updateMutation.isPending}
                                className="w-full bg-primary text-primary-foreground py-2 font-heading tracking-wider hover:bg-primary/90"
                            >
                                {editingId ? "UPDATE POST" : "CREATE POST"}
                            </button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4">
                {blogs?.map((blog: any) => (
                    <div key={blog.id} className="bg-surface-dark border border-primary/10 p-4 flex items-center justify-between">
                        <div className="flex-1">
                            <h3 className="font-heading text-lg text-surface-dark-foreground">{blog.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">{blog.content}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                            <button
                                onClick={() => handleEdit(blog)}
                                className="p-2 hover:bg-primary/10 text-primary rounded-full transition-colors"
                            >
                                <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => {
                                    if (confirm("Are you sure you want to delete this post?")) {
                                        deleteMutation.mutate(blog.id);
                                    }
                                }}
                                className="p-2 hover:bg-destructive/10 text-destructive rounded-full transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
                {blogs?.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No blog posts found.</p>
                )}
            </div>
        </div>
    );
};

export default AdminBlog;
