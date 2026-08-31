const BlogPost = require('../models/BlogPost');
const { sanitizeRelaxed, sanitizePlainText } = require('../utils/sanitizer');

exports.getAllPosts = async ({ category, page = 1, limit = 10, search }) => {
  const filter = { published: true };
  if (category) filter.category = category;
  if (search) {
    const regex = new RegExp(search.split(/\s+/).map(w => `(?=.*${w})`).join('') + '.*', 'i');
    filter.$or = [{ title: regex }, { excerpt: regex }, { content: regex }];
  }
  const [posts, count] = await Promise.all([
    BlogPost.find(filter).sort({ publishedAt: -1, createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit).lean(),
    BlogPost.countDocuments(filter),
  ]);
  return { data: posts, totalPages: Math.ceil(count / limit), currentPage: page, total: count, hasNextPage: page * limit < count, hasPrevPage: page > 1 };
};

exports.getPostBySlug = async (slug) => await BlogPost.findOne({ slug, published: true }).lean();

exports.createPost = async (data) => {
  const sanitized = {
    ...data,
    title: sanitizePlainText(data.title),
    excerpt: sanitizePlainText(data.excerpt),
    content: sanitizeRelaxed(data.content),
    author: sanitizePlainText(data.author),
    category: sanitizePlainText(data.category),
  };
  return BlogPost.create(sanitized);
};

exports.updatePost = async (id, data) => {
  const sanitized = {
    ...data,
    title: data.title ? sanitizePlainText(data.title) : undefined,
    excerpt: data.excerpt ? sanitizePlainText(data.excerpt) : undefined,
    content: data.content ? sanitizeRelaxed(data.content) : undefined,
    author: data.author ? sanitizePlainText(data.author) : undefined,
    category: data.category ? sanitizePlainText(data.category) : undefined,
  };
  return BlogPost.findByIdAndUpdate(id, sanitized, { new: true, runValidators: true });
};

exports.deletePost = async (id) => await BlogPost.findByIdAndDelete(id);

exports.getRelatedPosts = async (slug, limit = 3) => {
  const current = await BlogPost.findOne({ slug }).lean();
  if (!current) return [];
  return BlogPost.find({ _id: { $ne: current._id }, published: true, $or: [{ category: current.category }, { tags: { $in: current.tags || [] } }] }).sort({ publishedAt: -1 }).limit(limit).lean();
};
