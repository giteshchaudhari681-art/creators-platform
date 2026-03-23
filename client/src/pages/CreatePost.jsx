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
    status: 'draft',
    image: 'image-placeholder' // ✅ NEW DEFAULT IMAGE
  });

  const [imageUrl, setImageUrl] = useState(''); // ✅ NEW
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ✅ FIXED UPLOAD HANDLER
  const handleUpload = async (formData) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      console.log('UPLOAD RESPONSE:', data);

      if (data.success) {
        setImageUrl(data.url); // ✅ STORE IMAGE URL
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Upload failed');
      }

    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload error');
    }
  };

  // ✅ FIXED SUBMIT (NOW INCLUDES IMAGE)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/api/posts', {
        ...formData,
        image: imageUrl // ✅ ADD IMAGE HERE
      });

      if (response.data.success) {
        toast.success('Post created successfully!');
        navigate('/dashboard');
      }

    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Failed to create post';

      toast.error(message);
      setError(message);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Create New Post</h1>

      {/* ✅ IMAGE UPLOAD COMPONENT */}
      <ImageUpload onUpload={handleUpload} />

      {/* ✅ SHOW IMAGE PREVIEW AFTER UPLOAD */}
      {imageUrl && (
        <div style={{ marginTop: '1rem' }}>
          <p>Uploaded Image:</p>
          <img
            src={imageUrl}
            alt="uploaded"
            style={{ width: '200px', borderRadius: '8px' }}
          />
        </div>
      )}

      {error && <div>{error}</div>}

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

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
