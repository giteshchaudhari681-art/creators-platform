# 🚀 Quick Reference Guide - New Features

## 📦 Import Guide

### UI Components
```javascript
import {
  Button,
  Input,
  Textarea,
  Card,
  Badge,
  Modal,
  Alert,
  Spinner,
  Skeleton,
  Select
} from '@/components/UI';
```

### Custom Hooks
```javascript
import {
  useForm,
  useFetch,
  useLocalStorage,
  useDebounce,
  useClickOutside,
  usePrevious,
  useAsync,
  useToggle,
  useCounter,
  usePagination
} from '@/hooks';
```

### Validators
```javascript
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
  validateName,
  validateTitle,
  validateDescription,
  validateContent,
  validateUrl,
  validatePhoneNumber,
  validateUsername,
  validateNumberRange,
  validateFileSize,
  validateFileType,
  validateForm,
  hasFormErrors
} from '@/utils/validation';
```

### Constants
```javascript
import {
  API_BASE_URL,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ROUTES,
  USER_ROLES,
  POST_STATUS,
  IMAGE_FORMATS,
  PAGINATION,
  LOCAL_STORAGE_KEYS,
  THEMES,
  SOCKET_EVENTS,
  ANIMATIONS
} from '@/utils/constants';
```

---

## 🎨 UI Components - Detailed Usage

### Button Component
```javascript
// Basic
<Button>Click Me</Button>

// With variant
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="danger">Danger</Button>
<Button variant="ghost">Ghost</Button>

// With size
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>

// Loading state
<Button loading>Processing...</Button>

// Disabled
<Button disabled>Disabled</Button>

// With onClick handler
<Button onClick={() => doSomething()}>
  Click Me
</Button>

// Full example
<Button 
  variant="primary" 
  size="lg" 
  loading={isLoading}
  onClick={handleSubmit}
>
  Submit Form
</Button>
```

### Input Component
```javascript
// Basic input
<Input 
  label="Email"
  name="email"
  type="email"
  placeholder="user@example.com"
/>

// With value and change handler
<Input
  label="Name"
  name="name"
  value={values.name}
  onChange={handleChange}
  onBlur={handleBlur}
/>

// With error display
<Input
  label="Email"
  name="email"
  value={values.email}
  onChange={handleChange}
  error={errors.email}  // Shows error message
/>

// With helper text
<Input
  label="Password"
  type="password"
  helper="Minimum 6 characters"
/>

// Required field
<Input
  label="Username"
  required
/>

// Disabled
<Input
  label="ID"
  value="12345"
  disabled
/>

// Full example with validation
<Input
  label="Email"
  name="email"
  type="email"
  value={values.email}
  onChange={handleChange}
  onBlur={handleBlur}
  error={errors.email}
  helper="We'll never share your email"
  required
/>
```

### Textarea Component
```javascript
// Basic
<Textarea 
  label="Description"
  name="description"
  placeholder="Enter description..."
/>

// With rows
<Textarea
  label="Content"
  name="content"
  rows={8}
/>

// With validation
<Textarea
  label="Bio"
  name="bio"
  value={values.bio}
  onChange={handleChange}
  error={errors.bio}
  maxLength={500}
/>
```

### Card Component
```javascript
// Basic card
<Card>
  <h2>Content Title</h2>
  <p>Card content goes here</p>
</Card>

// With hover effect
<Card hover>
  <p>Hover me!</p>
</Card>

// With custom styling
<Card className="bg-blue-50">
  <p>Custom styled card</p>
</Card>

// Nested structure
<Card>
  <Card.Header>Header</Card.Header>
  <Card.Body>Body content</Card.Body>
  <Card.Footer>Footer</Card.Footer>
</Card>

// As a list item
<Card hover className="mb-4">
  <div className="flex justify-between">
    <h3>Post Title</h3>
    <Badge variant="success">Active</Badge>
  </div>
  <p>Post content...</p>
</Card>
```

### Badge Component
```javascript
// Basic badge
<Badge>Default</Badge>

// Variants
<Badge variant="success">Success</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="primary">Primary</Badge>

// With icon-like usage
<div className="flex gap-2">
  {post.tags.map(tag => (
    <Badge key={tag} variant="info">{tag}</Badge>
  ))}
</div>

// Status display
<div>
  {user.active ? (
    <Badge variant="success">Active</Badge>
  ) : (
    <Badge variant="error">Inactive</Badge>
  )}
</div>
```

### Modal Component
```javascript
// Basic modal
<Modal open={isOpen} onClose={handleClose}>
  <Modal.Header>Title</Modal.Header>
  <Modal.Body>Content</Modal.Body>
  <Modal.Footer>
    <Button onClick={handleClose}>Close</Button>
    <Button variant="primary" onClick={handleConfirm}>
      Confirm
    </Button>
  </Modal.Footer>
</Modal>

// Confirmation modal
const [showConfirm, setShowConfirm] = useState(false);

<Modal open={showConfirm} onClose={() => setShowConfirm(false)}>
  <Modal.Header>Delete Post?</Modal.Header>
  <Modal.Body>
    <p>This action cannot be undone.</p>
  </Modal.Body>
  <Modal.Footer>
    <Button onClick={() => setShowConfirm(false)}>Cancel</Button>
    <Button variant="danger" onClick={handleDelete}>
      Delete
    </Button>
  </Modal.Footer>
</Modal>
```

### Alert Component
```javascript
// Success alert
<Alert variant="success" title="Success!">
  Operation completed successfully.
</Alert>

// Error alert
<Alert variant="error" title="Error">
  Something went wrong.
</Alert>

// Warning alert
<Alert variant="warning" title="Warning">
  Please review before continuing.
</Alert>

// Info alert
<Alert variant="info" title="Information">
  Here's something you should know.
</Alert>

// Closeable alert
const [showAlert, setShowAlert] = useState(true);

{showAlert && (
  <Alert 
    variant="success" 
    onClose={() => setShowAlert(false)}
  >
    Alert message
  </Alert>
)}
```

### Spinner Component
```javascript
// Basic spinner
<Spinner />

// Different sizes
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />

// With label
<div className="flex items-center gap-2">
  <Spinner size="sm" />
  <span>Loading...</span>
</div>

// In a button
<Button loading>
  Uploading...
</Button>
```

### Skeleton Component
```javascript
// Text skeleton
<Skeleton className="h-4 w-full mb-2" />
<Skeleton className="h-4 w-3/4" />

// Card skeleton
<Card>
  <Skeleton className="h-40 w-full mb-4" />
  <Skeleton className="h-6 w-1/2 mb-2" />
  <Skeleton className="h-4 w-full" />
</Card>

// Avatar skeleton
<Skeleton className="h-12 w-12 rounded-full" />

// While loading
{loading ? (
  <>
    <Skeleton className="h-60 w-full mb-4" />
    <Skeleton className="h-4 w-1/2" />
  </>
) : (
  <>
    <img src={image} />
    <p>{title}</p>
  </>
)}
```

---

## 🪝 Custom Hooks - Detailed Usage

### useForm Hook
```javascript
function LoginPage() {
  const { 
    values, 
    errors, 
    touched,
    isSubmitting,
    handleChange, 
    handleBlur,
    handleSubmit, 
    resetForm,
    setFieldValue
  } = useForm(
    // Initial values
    { 
      email: '', 
      password: '' 
    },
    // Submission handler
    async (values) => {
      const response = await api.post('/login', values);
      navigate('/dashboard');
    },
    // Validation config
    {
      email: validateEmail,
      password: validatePassword
    }
  );

  return (
    <form onSubmit={handleSubmit}>
      <Input
        name="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.email ? errors.email : null}
      />
      <Input
        type="password"
        name="password"
        value={values.password}
        onChange={handleChange}
        error={touched.password ? errors.password : null}
      />
      <Button type="submit" loading={isSubmitting}>
        Login
      </Button>
      <button type="button" onClick={resetForm}>
        Reset
      </button>
    </form>
  );
}
```

### useFetch Hook
```javascript
function PostsList() {
  // Fetch with auto-loading and error handling
  const { data: posts, loading, error, refetch } = useFetch('/api/posts');

  if (loading) return <Spinner />;
  if (error) return <Alert variant="error">{error}</Alert>;

  return (
    <>
      <button onClick={refetch}>Refresh</button>
      {posts.map(post => (
        <Card key={post._id} hover>
          <h3>{post.title}</h3>
          <p>{post.description}</p>
        </Card>
      ))}
    </>
  );
}
```

### useLocalStorage Hook
```javascript
function ThemeToggle() {
  // Persist theme preference to localStorage
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  return (
    <>
      <p>Current theme: {theme}</p>
      <Button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </Button>
    </>
  );
}
```

### useDebounce Hook
```javascript
function SearchPosts() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Debounce search to avoid excessive API calls
  const debouncedTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedTerm) {
      searchPosts(debouncedTerm);
    }
  }, [debouncedTerm]);

  return (
    <Input
      placeholder="Search..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
}
```

### useClickOutside Hook
```javascript
function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown when clicking outside
  useClickOutside(ref, () => setIsOpen(false));

  return (
    <div ref={ref} className="relative">
      <Button onClick={() => setIsOpen(!isOpen)}>
        Options
      </Button>
      {isOpen && (
        <div className="absolute bg-white border">
          <button onClick={() => { /* action */ }}>Edit</button>
          <button onClick={() => { /* action */ }}>Delete</button>
        </div>
      )}
    </div>
  );
}
```

### usePrevious Hook
```javascript
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCount}</p>
      <Button onClick={() => setCount(count + 1)}>Increment</Button>
    </div>
  );
}
```

### useAsync Hook
```javascript
function AsyncExample() {
  // Handle async operations with status
  const { status, value, error, execute } = useAsync(
    async () => {
      const response = await api.get('/data');
      return response.data;
    }
  );

  return (
    <>
      <Button onClick={execute}>Load Data</Button>
      {status === 'pending' && <Spinner />}
      {status === 'error' && <Alert variant="error">{error}</Alert>}
      {status === 'success' && <div>{JSON.stringify(value)}</div>}
    </>
  );
}
```

### useToggle Hook
```javascript
function ShowMore() {
  // Simple boolean toggle
  const [isExpanded, toggle] = useToggle(false);

  return (
    <>
      <p>{isExpanded && 'Full content here...'}</p>
      <Button onClick={toggle}>
        {isExpanded ? 'Show Less' : 'Show More'}
      </Button>
    </>
  );
}
```

### useCounter Hook
```javascript
function Counter() {
  // Counter with increment, decrement, reset
  const { count, increment, decrement, reset } = useCounter(0);

  return (
    <div>
      <p>Count: {count}</p>
      <Button onClick={increment}>+</Button>
      <Button onClick={decrement}>-</Button>
      <Button onClick={reset}>Reset</Button>
    </div>
  );
}
```

### usePagination Hook
```javascript
function PaginatedList() {
  const [items] = useState([...allItems]);
  
  const { 
    currentItems, 
    currentPage, 
    totalPages,
    canPreviousPage,
    canNextPage, 
    previousPage, 
    nextPage 
  } = usePagination(items, 10);

  return (
    <>
      {currentItems.map(item => (
        <Card key={item.id}>{item.name}</Card>
      ))}
      
      <div className="flex gap-2 mt-4">
        <Button onClick={previousPage} disabled={!canPreviousPage}>
          Previous
        </Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button onClick={nextPage} disabled={!canNextPage}>
          Next
        </Button>
      </div>
    </>
  );
}
```

---

## ✅ Validation Functions - Usage

```javascript
// Single field validation
if (!validateEmail(email)) {
  setError('Invalid email');
}

// Password strength
if (!validatePassword(password)) {
  setError('Password must be at least 6 characters');
}

// Confirm passwords match
if (!validatePasswordConfirm(password, confirmPassword)) {
  setError('Passwords do not match');
}

// With useForm hook
const { values, errors, handleChange } = useForm(
  initialValues,
  onSubmit,
  {
    email: validateEmail,
    password: validatePassword,
    name: validateName,
    title: validateTitle,
    description: validateDescription,
    content: validateContent,
    url: validateUrl,
    phone: validatePhoneNumber,
    username: validateUsername
  }
);

// File validation
if (!validateFileType(file, 'image')) {
  setError('File must be an image');
}

if (!validateFileSize(file, 5 * 1024 * 1024)) { // 5MB
  setError('File size must be less than 5MB');
}

// Batch validation
const errors = validateForm(formData, {
  email: validateEmail,
  password: validatePassword
});

if (hasFormErrors(errors)) {
  console.log('Form has errors');
}
```

---

## 📊 Constants Usage

```javascript
// API Endpoints
fetch(`${API_BASE_URL}/posts`);

// Status codes
if (response.status === HTTP_STATUS.SUCCESS) {
  // Handle success
}

// Messages
showAlert(SUCCESS_MESSAGES.LOGIN_SUCCESS);
showError(ERROR_MESSAGES.NETWORK_ERROR);

// Routes
navigate(ROUTES.DASHBOARD);

// Pagination
const items = data.slice(0, PAGINATION.DEFAULT_PAGE_SIZE);

// Local storage
localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, token);

// Socket events
socket.emit(SOCKET_EVENTS.POST_CREATED, post);
```

---

## 🧪 Running Tests

```bash
# All tests
npm test

# Specific test file
npm test auth.test.js

# With coverage
npm test -- --coverage

# Watch mode
npm test -- --watch

# Verbose output
npm test -- --verbose
```

---

## 🎯 Common Patterns

### Login Form with Validation
```javascript
function LoginPage() {
  const { values, errors, handleChange, handleSubmit } = useForm(
    { email: '', password: '' },
    async (values) => {
      const response = await api.post('/auth/login', values);
      localStorage.setItem('token', response.token);
      navigate('/dashboard');
    },
    { email: validateEmail, password: validatePassword }
  );

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
        />
        <Button variant="primary" type="submit">
          Login
        </Button>
      </form>
    </Card>
  );
}
```

### Data Fetching with Loading State
```javascript
function PostsList() {
  const { data: posts, loading, error } = useFetch('/api/posts');

  return (
    <div>
      {loading && <Skeleton className="h-60 w-full" />}
      {error && <Alert variant="error">{error}</Alert>}
      {posts?.map(post => (
        <Card key={post._id} hover>\
          <h3>{post.title}</h3>
          <p>{post.description}</p>
        </Card>
      ))}
    </div>
  );
}
```

### Search with Debounce
```javascript
function SearchComponent() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const { data: results } = useFetch(
    `/api/search?q=${debouncedQuery}`
  );

  return (
    <>
      <Input
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {results?.map(item => (
        <Card key={item.id}>{item.name}</Card>
      ))}
    </>
  );
}
```

---

## 📝 Tips & Best Practices

1. **Always validate forms** - Use validators before submitting
2. **Use useLocalStorage** for user preferences
3. **Debounce search** to reduce API calls
4. **Show loading states** - Use Spinner while fetching
5. **Display errors** - Use Alert components
6. **Use Skeleton** while waiting for images
7. **Combine hooks** - useForm + useLocalStorage + useFetch
8. **Create custom validators** - Extend validation.js for custom rules

---

**Happy coding! 🚀**
