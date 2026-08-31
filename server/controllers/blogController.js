const blogService = require('../services/blogService');
const activityLogService = require('../services/activityLogService');

exports.getAllPosts = async (req, res) => {
  try {
    const { category, page = 1, limit = 10, search } = req.query;
    const result = await blogService.getAllPosts({ category, page: parseInt(page), limit: parseInt(limit), search });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPostBySlug = async (req, res) => {
  try {
    const post = await blogService.getPostBySlug(req.params.slug);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const post = await blogService.createPost(req.body);
    await activityLogService.logActivity(req.user.id, 'CREATE', 'BlogPost', post._id, { title: post.title }, req);
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await blogService.updatePost(req.params.id, req.body);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    await activityLogService.logActivity(req.user.id, 'UPDATE', 'BlogPost', post._id, { title: post.title }, req);
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await blogService.deletePost(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    await activityLogService.logActivity(req.user.id, 'DELETE', 'BlogPost', post._id, { title: post.title }, req);
    res.status(200).json({ success: true, message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRelatedPosts = async (req, res) => {
  try {
    const { slug } = req.params;
    const { limit = 3 } = req.query;
    const posts = await blogService.getRelatedPosts(slug, parseInt(limit));
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
