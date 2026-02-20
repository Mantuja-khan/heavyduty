const Blog = require('../models/Blog');

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ published: true }).sort({ createdAt: -1 });
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single blog
// @route   GET /api/blogs/:slug
// @access  Public
const getBlog = async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug });
        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a blog post
// @route   POST /api/blogs
// @access  Private/Admin
const createBlog = async (req, res) => {
    const { title, content, image_url, published } = req.body;

    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    try {
        const blog = await Blog.create({
            title,
            slug,
            content,
            image_url,
            published,
            author: req.user.username
        });
        res.status(201).json(blog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a blog post
// @route   PUT /api/blogs/:id
// @access  Private/Admin
const updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json(updatedBlog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a blog post
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        await blog.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getBlogs,
    getBlog,
    createBlog,
    updateBlog,
    deleteBlog
};
