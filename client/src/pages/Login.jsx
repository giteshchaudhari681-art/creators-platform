import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  const handleLoginSubmit = (credentials) => {
    console.log('Login submitted:', credentials);
  };

  return <LoginForm onSubmit={handleLoginSubmit} />;
};

export default Login;
