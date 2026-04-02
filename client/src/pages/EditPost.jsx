import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import ImageUpload from '../components/ImageUpload';
import { Alert, Button, Card, Input, Spinner, Textarea } from '../components/UI';

const categories = ['Technology', 'Lifestyle', 'Travel', 'Food', 'Business', 'Health', 'Education', 'Other'];

const countWords = (text) => text.trim().split(/\s+/).filter(Boolean).length;
const readingTime = (text) => Math.max(1, Math.ceil(countWords(text) / 200));

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Technology',
    status: 'draft',
    coverImage: '',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/api/posts/${id}`);
        const post = response.data.data;
        const cover = post.coverImage || post.image || '';

        setFormData({
          title: post.title,
          content: post.content,
          category: post.category || 'Technology',
          status: post.status || 'draft',
          coverImage: cover,
        });
        setImageUrl(cover);
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to load post';
        toast.error(message);
        setApiError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.title.trim()) {
      nextErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      nextErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.trim().length > 100) {
      nextErrors.title = 'Title cannot exceed 100 characters';
    }

    if (!formData.content.trim()) {
      nextErrors.content = 'Content is required';
    } else if (formData.content.trim().length < 50) {
      nextErrors.content = 'Content must be at least 50 characters';
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((current) => ({ ...current, [name]: '' }));
    }
    if (apiError) setApiError('');
  };

  const handleImageUpload = async (formDataObj) => {
    try {
      const response = await api.post('/api/upload', formDataObj);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Upload failed');
      }

      setImageUrl(response.data.url);
      setFormData((current) => ({ ...current, coverImage: response.data.url }));
      toast.success('Image uploaded successfully');
    } catch {
      toast.error('Upload error');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.put(`/api/posts/${id}`, formData);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update post');
      }

      toast.success('Post updated successfully');
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update post';
      toast.error(message);
      setApiError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-state">
        <Spinner size="lg" />
        <p>Loading post...</p>
      </div>
    );
  }

  const words = countWords(formData.content);
  const minutes = readingTime(formData.content);

  return (
    <section className="editor-page">
      <div className="shell-container editor-stack">
        <div className="editor-hero">
          <div>
            <span className="eyebrow">Edit Flow</span>
            <h1>Refine the post without losing context.</h1>
            <p>Adjust title, cover, category, and structure while keeping a live sense of the final result.</p>
          </div>
          <div className="editor-hero__meta">
            <div>
              <strong>{words}</strong>
              <span>Words</span>
            </div>
            <div>
              <strong>{minutes} min</strong>
              <span>Read time</span>
            </div>
            <div>
              <strong>{formData.status}</strong>
              <span>Publishing state</span>
            </div>
          </div>
        </div>

        {apiError && (
          <Alert variant="error" title="Update Failed">
            {apiError}
          </Alert>
        )}

        <div className="editor-grid">
          <Card className="editor-form">
            <div className="editor-section-title editor-section-title--split">
              <div>
                <span className="eyebrow">Post Editor</span>
                <h2>Update content</h2>
              </div>
              <Button variant="outline" onClick={() => navigate('/dashboard')} disabled={isSubmitting}>
                Back to Dashboard
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Post Title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Refine the title for clarity and impact"
                error={formErrors.title}
                disabled={isSubmitting}
                required
              />

              <Textarea
                label="Post Content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Strengthen weak sections, remove clutter, and improve flow."
                error={formErrors.content}
                disabled={isSubmitting}
                rows={14}
                required
              />

              <div className="editor-select-grid">
                <label className="dashboard-field">
                  <span>Category</span>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="input-field px-4 py-3"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="dashboard-field">
                  <span>Status</span>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="input-field px-4 py-3"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </label>
              </div>

              <div className="editor-upload">
                <div className="editor-section-title">
                  <h3>Refresh cover image</h3>
                  <p>Swap the visual if the story angle has changed.</p>
                </div>
                <ImageUpload onUpload={handleImageUpload} />
              </div>

              <div className="editor-actions">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Save Post Changes'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/dashboard')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>

          <Card className="editor-preview">
            <div className="editor-section-title">
              <span className="eyebrow">Updated Preview</span>
              <h2>{formData.title || 'The edited title will appear here'}</h2>
            </div>

            {imageUrl ? (
              <img src={imageUrl} alt="Post cover" className="editor-preview__image" />
            ) : (
              <div className="editor-preview__placeholder">No cover image selected</div>
            )}

            <div className="editor-preview__meta">
              <span>{formData.category}</span>
              <span>{formData.status}</span>
              <span>{minutes} min read</span>
            </div>

            <p className="editor-preview__copy">
              {formData.content
                ? `${formData.content.substring(0, 420)}${formData.content.length > 420 ? '...' : ''}`
                : 'Update the body to preview the edited reading experience.'}
            </p>

            <div className="editor-preview__tips">
              <strong>Editing prompts</strong>
              <span>Tighten the first paragraph.</span>
              <span>Remove repeated ideas.</span>
              <span>Match the cover with the final angle.</span>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default EditPost;
