import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import ImageUpload from '../components/ImageUpload';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Technology',
    status: 'draft'
  });

  const [coverImageUrl, setCoverImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpload = async (formData) => {
    setUploading(true);
    setUploadError('');

    try {
      const response = await api.post('/api/upload', formData);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Upload failed');
      }

      setCoverImageUrl(response.data.url);
      toast.success('Image uploaded successfully!');
      return response.data.url;

    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Image upload failed';
      setUploadError(message);
      toast.error(message);
      return null;

    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required.');
      toast.error('Title and content are required.');
      return;
    }

    setSubmitting(true);

    try {
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        status: formData.status,
        coverImage: coverImageUrl || null
      };

      const response = await api.post('/api/posts', postData);

      if (response.data.success) {
        toast.success('Post created successfully!');

        setFormData({
          title: '',
          content: '',
          category: 'Technology',
          status: 'draft'
        });
        setCoverImageUrl(null);
        setUploadError('');

        navigate('/dashboard');
      }

    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create post';
      setError(message);
      toast.error(message);

    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Create New Post</h1>

      {/* ✅ IMAGE UPLOAD COMPONENT */}
      <ImageUpload onUpload={handleUpload} uploading={uploading} />

      {uploading && <p>Uploading image, please wait...</p>}
      {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}

      {/* ✅ SHOW IMAGE PREVIEW AFTER UPLOAD */}
      {coverImageUrl && (
        <div style={{ marginTop: '1rem' }}>
          <p>Uploaded Image:</p>
          <img
            src={coverImageUrl}
            alt="Cover image preview"
            style={{ width: '200px', borderRadius: '8px' }}
          />
        </div>
      )}

      {error && <div style={{ color: 'red' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter post title"
          required
        />

        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Write your post content..."
          rows="10"
          required
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="Technology">Technology</option>
          <option value="Lifestyle">Lifestyle</option>
          <option value="Travel">Travel</option>
          <option value="Food">Food</option>
        </select>

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        <button type="submit" disabled={submitting || uploading}>
          {submitting ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
