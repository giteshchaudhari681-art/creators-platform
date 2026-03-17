import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    status: ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await api.get(`/api/posts/${id}`);
      const post = response.data.data;

      setFormData({
        title: post.title,
        content: post.content,
        category: post.category,
        status: post.status
      });

      setIsLoading(false);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load post');
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      const response = await api.put(`/api/posts/${id}`, formData);

      if (response.data.success) {
        navigate('/dashboard');
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div>Loading post...</div>;
  }

  return (
    <div>
      <h1>Edit Post</h1>

      {error && <div>{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
        />

        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
        />

        <button type="submit">
          {isSaving ? 'Saving...' : 'Update Post'}
        </button>
      </form>
    </div>
  );
};

export default EditPost;