import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />

        <div className="app-shell">
          <Header />

          <main className="app-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create"
                element={
                  <ProtectedRoute>
                    <CreatePost />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit/:id"
                element={
                  <ProtectedRoute>
                    <EditPost />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />

          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

const NotFound = () => {
  return (
    <section className="page-section">
      <div className="shell-container">
        <div className="hero-card mx-auto max-w-3xl text-center">
          <span className="eyebrow">Missing Route</span>
          <h1>404</h1>
          <p className="hero-copy">
            The page you requested is not part of the current creator workflow.
          </p>
          <div className="hero-actions justify-center">
            <Link to="/" className="btn btn-primary px-6 py-3">
              Return Home
            </Link>
            <Link to="/dashboard" className="btn btn-outline px-6 py-3">
              Open Dashboard
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default App;
