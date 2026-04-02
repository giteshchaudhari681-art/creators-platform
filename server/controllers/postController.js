import Post from '../models/Post.js';

const handleValidationError = (error, res, fallbackMessage) => {
  if (error.name === 'ValidationError') {
    const firstMessage = Object.values(error.errors)[0]?.message || fallbackMessage;
    return res.status(400).json({
      success: false,
      message: firstMessage,
    });
  }

  return null;
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
  try {
    const { title, content, category, status, coverImage } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required',
      });
    }

    const post = await Post.create({
      title,
      content,
      category,
      status,
      coverImage: coverImage || null,
      author: req.user._id,
    });

    return res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('Create post error:', error);

    const validationResponse = handleValidationError(error, res, 'Invalid post data');
    if (validationResponse) {
      return validationResponse;
    }

    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get posts with pagination
// @route   GET /api/posts?page=1&limit=10
// @access  Private
export const getPosts = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find({ author: req.user._id })
        .select('title content author category status coverImage createdAt likes')
        .populate('author', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments({ author: req.user._id }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error('Get posts error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching posts',
      error: error.message,
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
        message: 'Post not found',
      });
    }

    if (post.author._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this post',
      });
    }

    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('Get post error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching post',
      error: error.message,
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
        message: 'Post not found',
      });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post',
      });
    }

    const { title, content, category, status, coverImage } = req.body;

    if (title) post.title = title;
    if (content) post.content = content;
    if (category) post.category = category;
    if (status) post.status = status;
    if (coverImage) post.coverImage = coverImage;

    const updatedPost = await post.save();

    return res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: updatedPost,
    });
  } catch (error) {
    console.error('Update post error:', error);

    const validationResponse = handleValidationError(error, res, 'Invalid post update');
    if (validationResponse) {
      return validationResponse;
    }

    return res.status(500).json({
      success: false,
      message: 'Error updating post',
      error: error.message,
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
        message: 'Post not found',
      });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post',
      });
    }

    await post.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    console.error('Delete post error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting post',
      error: error.message,
    });
  }
};

// @desc    Like a post
// @route   POST /api/posts/:id/like
// @access  Private
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const alreadyLiked = post.likes.some((like) => like.toString() === req.user._id.toString());
    if (!alreadyLiked) {
      post.likes.push(req.user._id);
      await post.save();
    }

    return res.status(200).json({
      success: true,
      message: alreadyLiked ? 'Post already liked' : 'Post liked successfully',
      data: {
        id: post._id,
        likes: post.likes,
        likeCount: post.likes.length,
      },
    });
  } catch (error) {
    console.error('Like post error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error liking post',
      error: error.message,
    });
  }
};
