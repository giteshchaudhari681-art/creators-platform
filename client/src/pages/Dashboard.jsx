import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import api from '../services/api';
import socket from '../services/socket';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout, loading } = useAuth();

  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      console.log('🔌 Socket connected:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    socket.on('newPost', (data) => {
      toast.success(data.message);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('newPost');
      socket.disconnect();
    };

  }, []);

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const fetchPosts = async (page) => {
    try {
      setIsLoadingPosts(true);

      const response = await api.get(`/api/posts?page=${page}&limit=10`);

      setPosts(response.data.data);
      setPagination(response.data.pagination);

    } catch (error) {

      const message =
        error.response?.data?.message ||
        'Failed to load posts';

      toast.error(message);
      setError(message);
      setTimeout(() => setError(''), 5000);

    } finally {
      setIsLoadingPosts(false);
    }
  };

  const handleDelete = async (postId) => {

    const confirmed = window.confirm(
      'Are you sure you want to delete this post?'
    );

    if (!confirmed) return;

    setDeletingId(postId);

    try {

      const response = await api.delete(`/api/posts/${postId}`);

      if (response.data.success) {

        setPosts(posts.filter((post) => post._id !== postId));

        setPagination((prev) => ({
          ...prev,
          total: prev.total - 1
        }));

        toast.success('Post deleted successfully');
        setError('');

      }

    } catch (error) {

      const message =
        error.response?.data?.message ||
        'Failed to delete post';

      toast.error(message);
      setTimeout(() => setError(''), 5000);

    } finally {
      setDeletingId(null);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const filteredPosts = posts
    .filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div style={containerStyle}>

      <div style={headerStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.8rem' }}>📊 Dashboard</h1>
            <p style={{ margin: '0.25rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>Welcome back, {user.name}!</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/create">
              <button style={createButtonStyle}>
                ✏️ Create Post
              </button>
            </Link>
            <button onClick={logout} style={logoutButtonStyle}>
              👋 Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats and Controls */}
      <div style={controlsContainerStyle}>
        <div style={statsStyle}>
          <div style={statItemStyle}>
            <span style={statNumberStyle}>{pagination.total || 0}</span>
            <span style={statLabelStyle}>Total Posts</span>
          </div>
        </div>

        <div style={filterControlsStyle}>
          <input
            type="text"
            placeholder="🔍 Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInputStyle}
          />
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={sortSelectStyle}
          >
            <option value="newest">📅 Newest First</option>
            <option value="oldest">📅 Oldest First</option>
            <option value="title">A-Z Title</option>
          </select>
        </div>
      </div>

      {error && <div style={errorStyle}>❌ {error}</div>}

      {isLoadingPosts ? (
        <div style={loadingPostsStyle}>Loading posts...</div>
      ) : (
        <div style={postsContainerStyle}>

          {filteredPosts.length === 0 && posts.length > 0 ? (
            <div style={emptyStateStyle}>
              <p>🔍 No posts match your search criteria.</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSortBy('newest');
                }} 
                style={resetButtonStyle}
              >
                Reset Search
              </button>
            </div>
          ) : posts.length === 0 ? (
            <div style={emptyStateStyle}>
              <p>You haven't created any posts yet.</p>
              <Link to="/create">Create your first post</Link>
            </div>
          ) : (
            <>
              {posts.map((post) => (
                <div key={post._id} style={postCardStyle}>
                  <div style={postHeaderStyle}>
                    <div>
                      <h3 style={postTitleStyle}>{post.title}</h3>
                      <div style={metaStyle}>
                        <span style={categoryBadgeStyle}>{post.category}</span>
                        <span style={{
                          ...statusBadgeStyle,
                          backgroundColor: post.status === 'published' ? '#28a745' : '#ffc107',
                          color: post.status === 'published' ? 'white' : '#333'
                        }}>
                          {post.status}
                        </span>
                        <span style={dateStyle}>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {post.image && (
                      <img src={post.image} alt={post.title} style={postImageStyle} />
                    )}
                  </div>

                  <p style={contentPreviewStyle}>
                    {post.content.substring(0, 200)}
                    {post.content.length > 200 ? '...' : ''}
                  </p>

                  <div style={actionsStyle}>

                    <Link to={`/edit/${post._id}`}>
                      <button style={editButtonStyle}>
                        ✏️ Edit
                      </button>
                    </Link>

                    <button
                      onClick={() => handleDelete(post._id)}
                      disabled={deletingId === post._id}
                      style={{
                        ...deleteButtonStyle,
                        opacity: deletingId === post._id ? 0.6 : 1,
                        cursor: deletingId === post._id ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {deletingId === post._id ? '🗑️ Deleting...' : '🗑️ Delete'}
                    </button>

                  </div>

                </div>
              ))}

              <div style={paginationStyle}>

                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  style={paginationButtonStyle}
                >
                  Previous
                </button>

                <span style={pageInfoStyle}>
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  style={paginationButtonStyle}
                >
                  Next
                </button>

              </div>
            </>
          )}

        </div>
      )}
    </div>
  );
};

const containerStyle = {
  minHeight: '80vh',
  padding: '2rem',
  maxWidth: '1200px',
  margin: '0 auto',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2rem',
  padding: '1.5rem',
  backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  color: 'white',
};

const controlsContainerStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 2fr',
  gap: '1.5rem',
  marginBottom: '2rem',
  backgroundColor: 'white',
  padding: '1.5rem',
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
};

const statsStyle = {
  display: 'flex',
  gap: '1rem',
  justifyContent: 'flex-start',
};

const statItemStyle = {
  display: 'flex',
  flexDirection: 'column',
  padding: '1rem',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  borderLeft: '4px solid #667eea',
  minWidth: '120px',
};

const statNumberStyle = {
  fontSize: '2rem',
  fontWeight: 'bold',
  color: '#667eea',
  lineHeight: '1',
};

const statLabelStyle = {
  fontSize: '0.85rem',
  color: '#666',
  marginTop: '0.5rem',
};

const filterControlsStyle = {
  display: 'flex',
  gap: '1rem',
  justifyContent: 'flex-end',
  alignItems: 'center',
};

const searchInputStyle = {
  flex: 1,
  maxWidth: '400px',
  padding: '0.75rem 1rem',
  fontSize: '0.95rem',
  border: '2px solid #e0e0e0',
  borderRadius: '8px',
  fontFamily: 'inherit',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  ':focus': {
    borderColor: '#667eea',
    outline: 'none'
  }
};

const sortSelectStyle = {
  padding: '0.75rem 1rem',
  fontSize: '0.95rem',
  border: '2px solid #e0e0e0',
  borderRadius: '8px',
  cursor: 'pointer',
  fontFamily: 'inherit',
  backgroundColor: 'white',
  minWidth: '150px',
};

const createButtonStyle = {
  padding: '0.65rem 1.5rem',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '0.95rem',
  transition: 'background-color 0.2s, transform 0.1s',
};

const logoutButtonStyle = {
  padding: '0.65rem 1.5rem',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '0.95rem',
  transition: 'background-color 0.2s, transform 0.1s',
};

const postsContainerStyle = {
  marginTop: '2rem'
};

const postCardStyle = {
  padding: '1.5rem',
  backgroundColor: 'white',
  borderRadius: '10px',
  marginBottom: '1.5rem',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
  border: '2px solid transparent',
  ':hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
    borderColor: '#667eea'
  }
};

const postHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '1rem',
  marginBottom: '1rem'
};

const postTitleStyle = {
  margin: '0 0 0.5rem 0',
  fontSize: '1.5rem',
  color: '#333'
};

const postImageStyle = {
  width: '120px',
  height: '120px',
  objectFit: 'cover',
  borderRadius: '6px',
  flexShrink: 0
};

const contentPreviewStyle = {
  margin: '1rem 0',
  color: '#666',
  lineHeight: '1.5',
  fontSize: '0.95rem'
};

const metaStyle = {
  display: 'flex',
  gap: '0.75rem',
  fontSize: '0.85rem',
  flexWrap: 'wrap',
  alignItems: 'center'
};

const categoryBadgeStyle = {
  backgroundColor: '#e7f3ff',
  color: '#0066cc',
  padding: '0.25rem 0.75rem',
  borderRadius: '20px',
  fontSize: '0.8rem',
  fontWeight: '500'
};

const statusBadgeStyle = {
  padding: '0.25rem 0.75rem',
  borderRadius: '20px',
  fontSize: '0.8rem',
  fontWeight: '500'
};

const dateStyle = {
  color: '#999',
  fontSize: '0.85rem'
};

const actionsStyle = {
  display: 'flex',
  gap: '1rem',
  marginTop: '1.5rem'
};

const editButtonStyle = {
  padding: '0.6rem 1.2rem',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '500',
  transition: 'background-color 0.2s',
};

const deleteButtonStyle = {
  padding: '0.6rem 1.2rem',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '500',
  transition: 'background-color 0.2s',
};

const paginationStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '1rem',
  marginTop: '2rem',
};

const paginationButtonStyle = {
  padding: '0.5rem 1rem',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const pageInfoStyle = {
  fontSize: '0.9rem',
  color: '#666',
};

const emptyStateStyle = {
  padding: '3rem 2rem',
  textAlign: 'center',
  backgroundColor: 'white',
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
};

const resetButtonStyle = {
  marginTop: '1rem',
  padding: '0.75rem 1.5rem',
  backgroundColor: '#667eea',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '500',
  transition: 'background-color 0.2s',
};

const errorStyle = {
  padding: '1rem 1.5rem',
  backgroundColor: '#fff3cd',
  color: '#856404',
  borderRadius: '8px',
  marginBottom: '1.5rem',
  border: '1px solid #ffc107',
  boxShadow: '0 2px 4px rgba(255, 193, 7, 0.2)',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem'
};

const loadingPostsStyle = {
  padding: '2rem',
  textAlign: 'center',
  backgroundColor: 'white',
  borderRadius: '8px',
  color: '#666'
};

export default Dashboard;