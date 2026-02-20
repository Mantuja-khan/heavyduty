const express = require('express');
const router = express.Router();
const { getBlogs, getBlog, createBlog, updateBlog, deleteBlog } = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getBlogs).post(protect, createBlog);
router.route('/:id').put(protect, updateBlog).delete(protect, deleteBlog);
router.route('/:slug').get(getBlog);

module.exports = router;
