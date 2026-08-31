const BlogPost = require('../models/BlogPost');
const Service = require('../models/Service');
const TeamMember = require('../models/TeamMember');
const ESGReport = require('../models/ESGReport');
const Job = require('../models/Job');
const logger = require('../utils/logger');

// Weights for different content types in search results
const TYPE_WEIGHTS = {
  service: 10,
  blogPost: 8,
  teamMember: 5,
  esgReport: 7,
  job: 6,
};

exports.search = async (query, options = {}) => {
  const { limit = 20, page = 1, type } = options;
  const searchRegex = new RegExp(query.split(/\s+/).map(w => `(?=.*${w})`).join('') + '.*', 'i');
  const words = query.split(/\s+/).filter(w => w.length > 2);

  if (!words.length) return { data: [], total: 0, page: 1, totalPages: 0 };

  const results = [];

  // Search Services
  if (!type || type === 'service') {
    const services = await Service.find({
      $or: [
        { title: searchRegex },
        { shortDescription: searchRegex },
        { fullDescription: searchRegex },
        { features: { $in: words.map(w => new RegExp(w, 'i')) } },
      ],
      isActive: true,
    }).limit(limit);

    services.forEach(s => results.push({
      type: 'service',
      title: s.title,
      excerpt: s.shortDescription,
      url: `/services/${s.slug}`,
      image: s.image,
      category: s.category,
      score: TYPE_WEIGHTS.service + (s.title.match(searchRegex) ? 5 : 0),
      _id: s._id,
    }));
  }

  // Search Blog Posts
  if (!type || type === 'blogPost') {
    const posts = await BlogPost.find({
      $or: [
        { title: searchRegex },
        { excerpt: searchRegex },
        { content: searchRegex },
        { category: { $in: words.map(w => new RegExp(w, 'i')) } },
      ],
      published: true,
    }).limit(limit);

    posts.forEach(p => results.push({
      type: 'blogPost',
      title: p.title,
      excerpt: p.excerpt,
      url: `/blog/${p.slug}`,
      image: p.coverImage,
      category: p.category,
      publishedAt: p.publishedAt,
      score: TYPE_WEIGHTS.blogPost + (p.title.match(searchRegex) ? 5 : 0),
      _id: p._id,
    }));
  }

  // Search Team Members
  if (!type || type === 'teamMember') {
    const members = await TeamMember.find({
      $or: [
        { name: searchRegex },
        { role: searchRegex },
        { bio: searchRegex },
      ],
      isActive: true,
    }).limit(limit);

    members.forEach(m => results.push({
      type: 'teamMember',
      title: m.name,
      excerpt: m.role,
      url: '/team',
      image: m.photo,
      category: 'Leadership',
      score: TYPE_WEIGHTS.teamMember,
      _id: m._id,
    }));
  }

  // Search ESG Reports
  if (!type || type === 'esgReport') {
    const reports = await ESGReport.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { tags: { $in: words.map(w => new RegExp(w, 'i')) } },
      ],
      published: true,
    }).limit(limit);

    reports.forEach(r => results.push({
      type: 'esgReport',
      title: r.title,
      excerpt: r.description,
      url: `/esg#${r._id}`,
      image: r.coverImage,
      category: 'ESG',
      publishedAt: r.publishedAt,
      score: TYPE_WEIGHTS.esgReport,
      _id: r._id,
    }));
  }

  // Search Jobs
  if (!type || type === 'job') {
    const jobs = await Job.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { department: searchRegex },
        { location: searchRegex },
        { requirements: { $in: words.map(w => new RegExp(w, 'i')) } },
      ],
      isActive: true,
    }).limit(limit);

    jobs.forEach(j => results.push({
      type: 'job',
      title: j.title,
      excerpt: j.description,
      url: '/careers',
      image: null,
      category: j.department,
      location: j.location,
      score: TYPE_WEIGHTS.job,
      _id: j._id,
    }));
  }

  // Sort by relevance score, then deduplicate by URL
  results.sort((a, b) => b.score - a.score);
  const unique = [];
  const seen = new Set();
  for (const r of results) {
    if (!seen.has(r.url)) {
      seen.add(r.url);
      unique.push(r);
    }
  }

  const total = unique.length;
  const paginated = unique.slice((page - 1) * limit, page * limit);

  return {
    data: paginated,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

exports.getSuggestions = async (query, limit = 8) => {
  if (!query || query.length < 2) return [];

  const regex = new RegExp(query, 'i');
  const [services, posts, jobs] = await Promise.all([
    Service.find({ title: regex, isActive: true }).limit(3).select('title slug'),
    BlogPost.find({ title: regex, published: true }).limit(3).select('title slug'),
    Job.find({ title: regex, isActive: true }).limit(2).select('title'),
  ]);

  return [
    ...services.map(s => ({ text: s.title, type: 'Service', url: `/services/${s.slug}` })),
    ...posts.map(p => ({ text: p.title, type: 'Blog', url: `/blog/${p.slug}` })),
    ...jobs.map(j => ({ text: j.title, type: 'Career', url: '/careers' })),
  ].slice(0, limit);
};
