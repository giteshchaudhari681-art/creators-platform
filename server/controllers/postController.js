import Post from '../models/Post.js';

// @desc    Create new post
// @route   POST /api/posts
// @access  Private

export const createPost = async (req, res) => {
  try {
    console.log('BODY:', req.body);
    console.log('REQ.USER:', req.user);

    const { title, content, category, status, coverImage } = req.body;

    // Validate input
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    // 🔥 FIX: use author from JWT
    const post = await Post.create({
      title,
      content,
      category,
      status,
      coverImage: coverImage || null,
      author: req.user._id   // ✅ THIS IS THE REAL FIX
    });

    res.status(201).json({
      success: true,
      data: post
    });

  } catch (error) {
    console.error('CREATE POST ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};


// @desc    Get posts with pagination
// @route   GET /api/posts?page=1&limit=10
// @access  Private
export const getPosts = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));

    const skip = (page - 1) * limit;

    // Optional explain output for debug-driven index verification
    if (process.env.NODE_ENV === 'development' && req.query.explain === '1') {
      const explainResult = await Post.find({ author: req.user._id })
        .sort({ createdAt: -1 })
        .limit(1)
        .explain('executionStats');
      console.log('🧾 Post query explain:', explainResult);
    }

    const [posts, total] = await Promise.all([
      Post.find({ author: req.user._id })
        .select('title content author category status coverImage createdAt')
        .populate('author', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments({ author: req.user._id })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching posts',
      error: error.message
    });
  }
};


// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Private
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .select('-__v')
      .populate('author', 'name email')
      .lean();

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // 🔥 FIX: compare with userId
    if (post.author._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this post'
      });
    }

    res.status(200).json({
      success: true,
      data: post
    });

  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching post',
      error: error.message
    });
  }
};


// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // 🔥 FIX
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }

    const { title, content, category, status, coverImage } = req.body;

    if (title) post.title = title;
    if (content) post.content = content;
    if (category) post.category = category;
    if (status) post.status = status;
    if (coverImage) post.coverImage = coverImage;

    const updatedPost = await post.save();

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: updatedPost
    });

  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating post',
      error: error.message
    });
  }
};


// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // 🔥 FIX
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
      data: { id: req.params.id }
    });

  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting post',
      error: error.message
    });
  }
};