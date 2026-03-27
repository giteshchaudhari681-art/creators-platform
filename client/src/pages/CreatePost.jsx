import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import ImageUpload from '../components/ImageUpload';
import { Alert, Button, Card, Input, Spinner, Textarea } from '../components/UI';
import { useForm } from '../hooks';
import { validateContent, validateTitle } from '../utils/validation';

const categories = ['Technology', 'Lifestyle', 'Travel', 'Food', 'Business', 'Health', 'Education', 'Other'];

const countWords = (text) => text.trim().split(/\s+/).filter(Boolean).length;
const readingTime = (text) => Math.max(1, Math.ceil(countWords(text) / 200));

const CreatePost = () => {
  const [coverImageUrl, setCoverImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit: handleFormSubmit,
    resetForm,
  } = useForm(
    {
      title: '',
      content: '',
      category: 'Technology',
      status: 'draft',
    },
    async (formValues) => {
      setApiError('');

      try {
        const response = await api.post('/api/posts', {
          title: formValues.title.trim(),
          content: formValues.content.trim(),
          category: formValues.category,
          status: formValues.status,
          coverImage: coverImageUrl || null,
        });

        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to create post');
        }

        toast.success('Post created successfully');
        resetForm();
        setCoverImageUrl(null);
        setUploadError('');
        navigate('/dashboard');
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to create post';
        setApiError(message);
        toast.error(message);
        throw error;
      }
    },
    {
      title: validateTitle,
      content: validateContent,
    }
  );

  const handleUpload = async (formData) => {
    setUploading(true);
    setUploadError('');

    try {
      const response = await api.post('/api/upload', formData);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Upload failed');
      }

      setCoverImageUrl(response.data.url);
      toast.success('Image uploaded successfully');
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

  const handleFormChange = (event) => {
    handleChange(event);
    if (apiError) setApiError('');
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    await handleFormSubmit(event);
  };

  const words = countWords(values.content);
  const minutes = readingTime(values.content);

  return (
    <section className="editor-page">
      <div className="shell-container editor-stack">
        <div className="editor-hero">
          <div>
            <span className="eyebrow">New Content</span>
            <h1>Compose with better structure and faster feedback.</h1>
            <p>
              Build a stronger post with live writing stats, cover image preview, and a cleaner publishing workflow.
            </p>
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
              <strong>{values.status}</strong>
              <span>Current state</span>
            </div>
          </div>
        </div>

        {apiError && (
          <Alert variant="error" title="Creation Failed">
            {apiError}
          </Alert>
        )}

        {uploadError && (
          <Alert variant="error" title="Upload Failed">
            {uploadError}
          </Alert>
        )}

        <div className="editor-grid">
          <Card className="editor-form">
            <div className="editor-section-title">
              <span className="eyebrow">Editor</span>
              <h2>Post details</h2>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              <Input
                label="Post Title"
                name="title"
                type="text"
                value={values.title}
                onChange={handleFormChange}
                placeholder="A sharp title that makes the post worth opening"
                error={errors.title}
                disabled={isSubmitting || uploading}
                required
              />

              <Textarea
                label="Post Content"
                name="content"
                value={values.content}
                onChange={handleFormChange}
                placeholder="Write a clear opening, one strong idea per section, and a clean ending."
                error={errors.content}
                disabled={isSubmitting || uploading}
                rows={14}
                required
              />

              <div className="editor-select-grid">
                <label className="dashboard-field">
                  <span>Category</span>
                  <select
                    name="category"
                    value={values.category}
                    onChange={handleFormChange}
                    disabled={isSubmitting || uploading}
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
                    value={values.status}
                    onChange={handleFormChange}
                    disabled={isSubmitting || uploading}
                    className="input-field px-4 py-3"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </label>
              </div>

              <div className="editor-upload">
                <div className="editor-section-title">
                  <h3>Cover image</h3>
                  <p>Use a strong visual to make the post feel finished.</p>
                </div>

                <ImageUpload onUpload={handleUpload} uploading={uploading} />

                {uploading && (
                  <div className="editor-upload__status">
                    <Spinner size="sm" />
                    <span>Uploading image...</span>
                  </div>
                )}
              </div>

              <div className="editor-actions">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={isSubmitting}
                  disabled={isSubmitting || uploading}
                >
                  {isSubmitting ? 'Creating...' : 'Publish Workspace Post'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/dashboard')}
                  disabled={isSubmitting || uploading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>

          <Card className="editor-preview">
            <div className="editor-section-title">
              <span className="eyebrow">Live Preview</span>
              <h2>{values.title || 'Your title preview appears here'}</h2>
            </div>

            {coverImageUrl ? (
              <img src={coverImageUrl} alt="Cover preview" className="editor-preview__image" />
            ) : (
              <div className="editor-preview__placeholder">Cover image preview</div>
            )}

            <div className="editor-preview__meta">
              <span>{values.category}</span>
              <span>{values.status}</span>
              <span>{minutes} min read</span>
            </div>

            <p className="editor-preview__copy">
              {values.content
                ? `${values.content.substring(0, 420)}${values.content.length > 420 ? '...' : ''}`
                : 'Start writing to see how the post reads in a cleaner presentation view.'}
            </p>

            <div className="editor-preview__tips">
              <strong>Writing checklist</strong>
              <span>Lead with one clear hook.</span>
              <span>Break long sections into smaller ideas.</span>
              <span>End with a useful takeaway or next step.</span>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CreatePost;
