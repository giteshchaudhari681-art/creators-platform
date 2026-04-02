// Reusable Button Component
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  loadingLabel = 'Loading...',
  className = '',
  ...props
}) => {
  const baseStyles = 'btn font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-indigo-700 focus:ring-primary',
    secondary: 'bg-secondary text-white hover:bg-rose-600 focus:ring-secondary',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'text-primary hover:bg-indigo-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {loadingLabel}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

// Reusable Input Component
export const Input = ({
  label,
  error,
  helperText,
  required = false,
  id,
  inputClassName = '',
  className = '',
  ...props
}) => {
  const inputId = id || props.name;

  return (
    <div className={`form-field ${className}`}>
      {label && (
        <label className="form-field__label" htmlFor={inputId}>
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`input-field ${error ? 'input-field--error' : ''} ${inputClassName}`}
        {...props}
      />
      {error && <p className="form-field__error">{error}</p>}
      {helperText && !error && <p className="form-field__helper">{helperText}</p>}
    </div>
  );
};

// Reusable Textarea Component
export const Textarea = ({
  label,
  error,
  helperText,
  required = false,
  rows = 4,
  id,
  inputClassName = '',
  className = '',
  ...props
}) => {
  const textareaId = id || props.name;

  return (
    <div className={`form-field ${className}`}>
      {label && (
        <label className="form-field__label" htmlFor={textareaId}>
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      <textarea
        rows={rows}
        id={textareaId}
        className={`input-field ${error ? 'input-field--error' : ''} ${inputClassName}`}
        {...props}
      />
      {error && <p className="form-field__error">{error}</p>}
      {helperText && !error && <p className="form-field__helper">{helperText}</p>}
    </div>
  );
};

// Reusable Card Component
export const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div className={`card ${hover ? 'card-hover' : ''} ${className}`} {...props}>
      {children}
    </div>
  );
};

// Reusable Badge Component
export const Badge = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'badge-primary',
    success: 'badge-success',
    error: 'badge-error',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <span className={`badge ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};

// Reusable Modal Component
export const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg shadow-xl ${sizes[size]} w-full animate-slideIn`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-dark">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
        {footer && <div className="p-6 border-t border-gray-200 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
};

// Reusable Alert Component
export const Alert = ({ variant = 'info', title, children, onClose, className = '' }) => {
  const variants = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  const icons = {
    info: '💡',
    success: '✓',
    warning: '⚠️',
    error: '✕',
  };

  return (
    <div className={`border-l-4 p-4 rounded ${variants[variant]} ${className} animate-slideIn`}>
      <div className="flex items-start gap-3">
        <span className="text-xl">{icons[variant]}</span>
        <div className="flex-1">
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          <p className="text-sm">{children}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors ml-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// Loading Spinner Component
export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <svg
      className={`animate-spin ${sizes[size]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

// Skeleton Loader Component
export const Skeleton = ({ width = 'w-full', height = 'h-4', circle = false, className = '' }) => {
  return (
    <div
      className={`skeleton ${width} ${height} ${circle ? 'rounded-full' : 'rounded'} ${className}`}
    />
  );
};

export default {
  Button,
  Input,
  Textarea,
  Card,
  Badge,
  Modal,
  Alert,
  Spinner,
  Skeleton,
};
