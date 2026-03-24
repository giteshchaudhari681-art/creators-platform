import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import ImageUpload from '../components/ImageUpload';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Technology',
    status: 'draft',
    image: ''
  });

  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const fetchPost = async () => {
    try {
      const response = await api.get(`/api/posts/${id}`);
      const post = response.data.data;

      setFormData({
        title: post.title,
        content: post.content,
        category: post.category || 'Technology',
        status: post.status || 'draft',
        image: post.image || ''
      });

      if (post.image) {
        setImageUrl(post.image);
      }

      setIsLoading(false);

    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Failed to load post';
      toast.error(message);
      setError(message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      errors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 100) {
      errors.title = 'Title cannot exceed 100 characters';
    }

    if (!formData.content.trim()) {
      errors.content = 'Content is required';
    } else if (formData.content.length < 10) {
      errors.content = 'Content must be at least 10 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };

  const handleImageUpload = async (formDataObj) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formDataObj
      });

      const data = await response.json();

      if (data.success) {
        setImageUrl(data.url);
        setFormData({
          ...formData,
          image: data.url
        });
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Upload failed');
      }

    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      const response = await api.put(`/api/posts/${id}`, formData);

      if (response.data.success) {

        toast.success('Post updated successfully!');
        navigate('/dashboard');
      }

    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Failed to update post';
      toast.error(message);
      setError(message);
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle}>Loading post...</div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>Edit Post</h1>
        <button
          onClick={() => navigate('/dashboard')}
          style={backButtonStyle}
        >
          ← Back to Dashboard
        </button>
      </div>

      {error && <div style={errorAlertStyle}>{error}</div>}

      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Post Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter post title"
            style={{
              ...inputStyle,
              borderColor: validationErrors.title ? '#dc3545' : '#ddd'
            }}
          />
          {validationErrors.title && (
            <span style={errorMessageStyle}>{validationErrors.title}</span>
          )}
          <small style={helperTextStyle}>Max 100 characters</small>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Post Content *</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your post content..."
            rows="10"
            style={{
              ...textareaStyle,
              borderColor: validationErrors.content ? '#dc3545' : '#ddd'
            }}
          />
          {validationErrors.content && (
            <span style={errorMessageStyle}>{validationErrors.content}</span>
          )}
          <small style={helperTextStyle}>Minimum 10 characters</small>
        </div>

        <div style={twoColumnStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={selectStyle}
            >
              <option value="Technology">Technology</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Travel">Travel</option>
              <option value="Food">Food</option>
            </select>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={selectStyle}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Post Image</label>
          <ImageUpload onUpload={handleImageUpload} />
          {imageUrl && (
            <div style={imagePreviewContainerStyle}>
              <p style={previewTitleStyle}>Current Image:</p>
              <img src={imageUrl} alt="Post" style={previewImageStyle} />
            </div>
          )}
        </div>

        <div style={actionsStyle}>
          <button
            type="submit"
            disabled={isSaving}
            style={{
              ...submitButtonStyle,
              opacity: isSaving ? 0.6 : 1,
              cursor: isSaving ? 'not-allowed' : 'pointer'
            }}
          >
            {isSaving ? '💾 Saving...' : '💾 Update Post'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            style={cancelButtonStyle}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const containerStyle = {
  minHeight: '80vh',
  padding: '2rem',
  maxWidth: '800px',
  margin: '0 auto'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2rem'
};

const backButtonStyle = {
  padding: '0.5rem 1rem',
  backgroundColor: '#6c757d',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '500',
  transition: 'background-color 0.2s'
};

const loadingStyle = {
  padding: '2rem',
  textAlign: 'center',
  fontSize: '1.1rem',
  color: '#666'
};

const errorAlertStyle = {
  padding: '1rem',
  backgroundColor: '#f8d7da',
  color: '#721c24',
  borderRadius: '6px',
  marginBottom: '1.5rem',
  border: '1px solid #f5c6cb'
};

const formStyle = {
  backgroundColor: 'white',
  padding: '2rem',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
};

const formGroupStyle = {
  marginBottom: '1.5rem',
  display: 'flex',
  flexDirection: 'column'
};

const labelStyle = {
  fontSize: '1rem',
  fontWeight: '600',
  marginBottom: '0.5rem',
  color: '#333'
};

const inputStyle = {
  padding: '0.75rem',
  fontSize: '1rem',
  border: '1px solid #ddd',
  borderRadius: '6px',
  fontFamily: 'inherit',
  transition: 'border-color 0.2s, box-shadow 0.2s'
};

const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
  fontFamily: 'inherit',
  padding: '0.75rem'
};

const selectStyle = {
  ...inputStyle,
  cursor: 'pointer',
  appearance: 'none',
  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 viewBox=%220 0 12 8%22%3E%3Cpath fill=%22%23333%22 d=%22M0 0l6 8 6-8z%22/%3E%3C/svg%3E")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 0.75rem center',
  backgroundSize: '12px',
  paddingRight: '2.5rem'
};

const twoColumnStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1rem',
  marginBottom: '1.5rem'
};

const errorMessageStyle = {
  color: '#dc3545',
  fontSize: '0.85rem',
  marginTop: '0.25rem'
};

const helperTextStyle = {
  color: '#999',
  fontSize: '0.85rem',
  marginTop: '0.25rem'
};

const imagePreviewContainerStyle = {
  marginTop: '1rem',
  padding: '1rem',
  backgroundColor: '#f8f9fa',
  borderRadius: '6px'
};

const previewTitleStyle = {
  margin: '0 0 0.5rem 0',
  fontSize: '0.9rem',
  color: '#666'
};

const previewImageStyle = {
  maxWidth: '100%',
  height: 'auto',
  maxHeight: '300px',
  borderRadius: '6px'
};

const actionsStyle = {
  display: 'flex',
  gap: '1rem',
  marginTop: '2rem'
};

const submitButtonStyle = {
  flex: 1,
  padding: '0.75rem 1.5rem',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s'
};

const cancelButtonStyle = {
  flex: 1,
  padding: '0.75rem 1.5rem',
  backgroundColor: '#6c757d',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s'
};

export default EditPost;