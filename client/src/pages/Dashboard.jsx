import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/useAuth';
import api from '../services/api';
import socket from '../services/socket';
import { Alert, Badge, Button, Card, Spinner } from '../components/UI';

const DASHBOARD_PREFERENCES_KEY = 'creatorhub-dashboard-preferences';

const emptyPreferences = {
  searchTerm: '',
  sortBy: 'newest',
  statusFilter: 'all',
  viewMode: 'list',
};

const Dashboard = () => {
  const { user, logout, loading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem(DASHBOARD_PREFERENCES_KEY);
      return saved ? { ...emptyPreferences, ...JSON.parse(saved) } : emptyPreferences;
    } catch {
      return emptyPreferences;
    }
  });

  useEffect(() => {
    let mounted = true;

    const handleNewPost = (data) => {
      toast.success(data.message || 'A new post event was received.');
      fetchPosts(currentPage);
    };

    const handleConnectError = () => {
      toast.error('Live updates are temporarily unavailable.');
    };

    const setupSocket = async () => {
      if (!mounted) return;

      await socket.connect();
      await socket.on('newPost', handleNewPost);
      await socket.on('connect_error', handleConnectError);
    };

    setupSocket();

    return () => {
      mounted = false;
      socket.off('newPost', handleNewPost);
      socket.off('connect_error', handleConnectError);
      socket.disconnect();
    };
  }, [currentPage]);

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem(DASHBOARD_PREFERENCES_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const fetchPosts = async (page) => {
    try {
      setIsLoadingPosts(true);
      const response = await api.get(`/api/posts?page=${page}&limit=10`);
      setPosts(response.data.data || []);
      setPagination(response.data.pagination || {});
      setError('');
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Failed to load posts';
      toast.error(message);
      setError(message);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const handleDelete = async (postId) => {
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;

    setDeletingId(postId);

    try {
      const response = await api.delete(`/api/posts/${postId}`);

      if (response.data.success) {
        setPosts((currentPosts) => currentPosts.filter((post) => post._id !== postId));
        setPagination((prev) => ({ ...prev, total: Math.max((prev.total || 1) - 1, 0) }));
        toast.success('Post deleted successfully');
      }
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Failed to delete post';
      toast.error(message);
      setError(message);
    } finally {
      setDeletingId(null);
    }
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences((current) => ({ ...current, [key]: value }));
  };

  const filteredPosts = posts
    .filter((post) => {
      const query = preferences.searchTerm.toLowerCase();
      const matchesSearch =
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query);
      const matchesStatus =
        preferences.statusFilter === 'all' || post.status === preferences.statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (preferences.sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (preferences.sortBy === 'title') return a.title.localeCompare(b.title);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const draftCount = posts.filter((post) => post.status === 'draft').length;
  const publishedCount = posts.filter((post) => post.status === 'published').length;
  const categories = [...new Set(posts.map((post) => post.category).filter(Boolean))];
  const latestPost = [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  const statusTone = draftCount > publishedCount ? 'warning' : 'success';

  if (loading) {
    return (
      <div className="dashboard-state">
        <Spinner size="lg" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <section className="dashboard-page">
      <div className="shell-container dashboard-stack">
        <div className="dashboard-hero">
          <div>
            <span className="eyebrow">Creator Dashboard</span>
            <h1>{user.name}, your content workspace is live.</h1>
            <p>
              Review publishing momentum, refine drafts, and manage posts with a cleaner control surface.
            </p>
          </div>

          <div className="dashboard-hero__actions">
            <Link to="/create" className="btn btn-primary px-6 py-3">
              Create Post
            </Link>
            <button type="button" className="btn btn-outline px-6 py-3" onClick={logout}>
              Log Out
            </button>
          </div>
        </div>

        <div className="dashboard-metrics">
          <Card className="metric-surface">
            <span>Total posts</span>
            <strong>{pagination.total || 0}</strong>
            <small>All content records available in your account</small>
          </Card>
          <Card className="metric-surface">
            <span>Published</span>
            <strong>{publishedCount}</strong>
            <small>Ready for the audience right now</small>
          </Card>
          <Card className="metric-surface">
            <span>Draft queue</span>
            <strong>{draftCount}</strong>
            <small>Posts that still need review or release</small>
          </Card>
          <Card className="metric-surface">
            <span>Categories</span>
            <strong>{categories.length}</strong>
            <small>Distinct content lanes in this page set</small>
          </Card>
        </div>

        <div className="dashboard-panels">
          <Card className="dashboard-panel">
            <div className="dashboard-panel__head">
              <div>
                <span className="eyebrow">Workspace Filters</span>
                <h2>Control the current view</h2>
              </div>
              <Button
                variant="ghost"
                onClick={() => setPreferences(emptyPreferences)}
                className="px-3 py-2"
              >
                Reset
              </Button>
            </div>

            <div className="dashboard-filter-grid">
              <label className="dashboard-field">
                <span>Search</span>
                <input
                  type="text"
                  value={preferences.searchTerm}
                  onChange={(event) => handlePreferenceChange('searchTerm', event.target.value)}
                  placeholder="Search title, content, or category"
                  className="input-field px-4 py-3"
                />
              </label>

              <label className="dashboard-field">
                <span>Sort by</span>
                <select
                  value={preferences.sortBy}
                  onChange={(event) => handlePreferenceChange('sortBy', event.target.value)}
                  className="input-field px-4 py-3"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="title">Title A-Z</option>
                </select>
              </label>

              <label className="dashboard-field">
                <span>Status</span>
                <select
                  value={preferences.statusFilter}
                  onChange={(event) => handlePreferenceChange('statusFilter', event.target.value)}
                  className="input-field px-4 py-3"
                >
                  <option value="all">All statuses</option>
                  <option value="published">Published only</option>
                  <option value="draft">Draft only</option>
                </select>
              </label>

              <div className="dashboard-field">
                <span>Layout</span>
                <div className="view-toggle">
                  <button
                    type="button"
                    className={`view-toggle__button${preferences.viewMode === 'list' ? ' is-active' : ''}`}
                    onClick={() => handlePreferenceChange('viewMode', 'list')}
                  >
                    List
                  </button>
                  <button
                    type="button"
                    className={`view-toggle__button${preferences.viewMode === 'grid' ? ' is-active' : ''}`}
                    onClick={() => handlePreferenceChange('viewMode', 'grid')}
                  >
                    Grid
                  </button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="dashboard-panel dashboard-panel--accent">
            <span className="eyebrow">Quick Insight</span>
            <h2>Publishing balance</h2>
            <p>
              {draftCount > publishedCount
                ? 'Your draft backlog is larger than your published catalog. Prioritize review and release.'
                : 'Your published posts are keeping pace. Keep the draft queue healthy for the next cycle.'}
            </p>
            <div className="dashboard-insight-list">
              <Badge variant={statusTone}>
                {draftCount} drafts in progress
              </Badge>
              <Badge variant="info">{filteredPosts.length} posts in current view</Badge>
              <Badge variant="primary">{pagination.page || 1} active page</Badge>
            </div>
            {latestPost && (
              <div className="latest-post-note">
                <strong>Latest update</strong>
                <span>
                  {latestPost.title} on {new Date(latestPost.createdAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </Card>
        </div>

        {error && (
          <Alert variant="error" title="Dashboard Error">
            {error}
          </Alert>
        )}

        {isLoadingPosts ? (
          <Card className="dashboard-loading">
            <Spinner size="lg" />
            <p>Loading your posts...</p>
          </Card>
        ) : filteredPosts.length === 0 && posts.length > 0 ? (
          <Card className="dashboard-empty">
            <h2>No posts match the current filters.</h2>
            <p>Try broadening your search or clearing the status restriction.</p>
            <Button variant="primary" onClick={() => setPreferences(emptyPreferences)}>
              Clear Filters
            </Button>
          </Card>
        ) : posts.length === 0 ? (
          <Card className="dashboard-empty">
            <h2>You have not created any posts yet.</h2>
            <p>Start the workspace with a first draft and publish when ready.</p>
            <Link to="/create" className="btn btn-primary px-6 py-3">
              Create First Post
            </Link>
          </Card>
        ) : (
          <>
            <div
              className={`post-collection${preferences.viewMode === 'grid' ? ' post-collection--grid' : ''}`}
            >
              {filteredPosts.map((post) => (
                <Card key={post._id} className="post-card" hover>
                  {post.coverImage ? (
                    <img src={post.coverImage} alt={`Cover for ${post.title}`} className="post-card__image" />
                  ) : (
                    <div className="post-card__placeholder">No cover image</div>
                  )}

                  <div className="post-card__body">
                    <div>
                      <div className="post-card__meta">
                        <Badge variant="primary">{post.category}</Badge>
                        <Badge variant={post.status === 'published' ? 'success' : 'warning'}>
                          {post.status}
                        </Badge>
                      </div>

                      <h3>{post.title}</h3>
                      <p className="post-card__copy">
                        {post.content.substring(0, 220)}
                        {post.content.length > 220 ? '...' : ''}
                      </p>
                    </div>

                    <div className="post-card__footer">
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <div className="post-card__actions">
                        <Link to={`/edit/${post._id}`} className="btn btn-outline px-4 py-2">
                          Edit
                        </Link>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(post._id)}
                          disabled={deletingId === post._id}
                          loading={deletingId === post._id}
                          className="px-4 py-2"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <Card className="pagination-bar">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((page) => page - 1)}
                  disabled={!pagination.hasPrevPage}
                >
                  Previous
                </Button>

                <span>
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((page) => page + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  Next
                </Button>
              </Card>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
