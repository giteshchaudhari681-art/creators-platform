import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const { user, logout, loading } = useAuth();

  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const fetchPosts = async (page) => {
    try {
      setIsLoadingPosts(true);

      const response = await api.get(`/api/posts?page=${page}&limit=10`);

      setPosts(response.data.data);
      setPagination(response.data.pagination);

    } catch (err) {
      console.error(err);
      setError('Failed to load posts');
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const handleDelete = async (postId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this post?'
    );

    if (!confirmed) return;

    try {
      const response = await api.delete(`/api/posts/${postId}`);

      if (response.data.success) {
        setPosts(posts.filter((post) => post._id !== postId));

        setPagination((prev) => ({
          ...prev,
          total: prev.total - 1
        }));

        alert('Post deleted successfully');
      }

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to delete post');
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

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
        <h1>Welcome, {user.name}!</h1>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/create">
            <button style={createButtonStyle}>
              + Create New Post
            </button>
          </Link>

          <button onClick={logout} style={logoutButtonStyle}>
            Logout
          </button>
        </div>
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      {isLoadingPosts ? (
        <div style={loadingPostsStyle}>Loading posts...</div>
      ) : (
        <div style={postsContainerStyle}>
          
          {posts.length === 0 ? (
            <div style={emptyStateStyle}>
              <p>You haven't created any posts yet.</p>
              <Link to="/create">Create your first post</Link>
            </div>
          ) : (
            <>
              {posts.map((post) => (
                <div key={post._id} style={postCardStyle}>
                  
                  <h3>{post.title}</h3>

                  <p style={contentPreviewStyle}>
                    {post.content.substring(0, 150)}...
                  </p>

                  <div style={metaStyle}>
                    <span>{post.category}</span>
                    <span>{post.status}</span>
                    <span>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div style={actionsStyle}>
                    
                    <Link to={`/edit/${post._id}`}>
                      <button style={editButtonStyle}>
                        Edit
                      </button>
                    </Link>

                    <button
                      onClick={() => handleDelete(post._id)}
                      style={deleteButtonStyle}
                    >
                      Delete
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
  padding: '1rem',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const logoutButtonStyle = {
  padding: '0.5rem 1.5rem',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: '500',
};

const createButtonStyle = {
  padding: '0.5rem 1.5rem',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: '500',
};

const postsContainerStyle = {
  marginTop: '2rem'
};

const postCardStyle = {
  padding: '1.5rem',
  backgroundColor: 'white',
  borderRadius: '8px',
  marginBottom: '1rem',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const contentPreviewStyle = {
  margin: '1rem 0',
  color: '#666'
};

const metaStyle = {
  display: 'flex',
  gap: '1rem',
  fontSize: '0.85rem',
  color: '#999',
};

const actionsStyle = {
  display: 'flex',
  gap: '1rem',
  marginTop: '1rem',
};

const editButtonStyle = {
  padding: '0.5rem 1rem',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const deleteButtonStyle = {
  padding: '0.5rem 1rem',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const paginationStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
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
  padding: '2rem',
  textAlign: 'center',
  backgroundColor: 'white',
  borderRadius: '8px',
};

const errorStyle = {
  padding: '1rem',
  backgroundColor: '#f8d7da',
  color: '#721c24',
  borderRadius: '5px',
};

const loadingPostsStyle = {
  textAlign: 'center',
  padding: '2rem'
};

export default Dashboard;