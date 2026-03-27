// Form Validation Utilities

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email';
  return '';
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return '';
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Confirm password is required';
  if (password !== confirmPassword) return 'Passwords do not match';
  return '';
};

export const validateName = (name) => {
  if (!name) return 'Name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  return '';
};

export const validateTitle = (title) => {
  if (!title) return 'Title is required';
  if (title.trim().length < 3) return 'Title must be at least 3 characters';
  if (title.length > 100) return 'Title must not exceed 100 characters';
  return '';
};

export const validateDescription = (description) => {
  if (!description) return 'Description is required';
  if (description.trim().length < 10) return 'Description must be at least 10 characters';
  return '';
};

export const validateContent = (content) => {
  if (!content) return 'Content is required';
  if (content.trim().length < 50) return 'Content must be at least 50 characters';
  return '';
};

export const validateUrl = (url) => {
  try {
    new URL(url);
    return '';
  } catch {
    return 'Please enter a valid URL';
  }
};

export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[+]?[0-9\s\-()]+$/;
  if (!phone) return 'Phone number is required';
  if (!phoneRegex.test(phone)) return 'Please enter a valid phone number';
  return '';
};

export const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  if (!username) return 'Username is required';
  if (!usernameRegex.test(username))
    return 'Username must be 3-20 characters and contain only letters, numbers, hyphens, and underscores';
  return '';
};

export const validateNumberRange = (value, min, max) => {
  const num = Number(value);
  if (isNaN(num)) return `${value} must be a number`;
  if (num < min) return `Value must be at least ${min}`;
  if (num > max) return `Value must not exceed ${max}`;
  return '';
};

export const validateFileSize = (file, maxSizeMB = 5) => {
  if (!file) return 'File is required';
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return `File size must not exceed ${maxSizeMB}MB`;
  }
  return '';
};

export const validateFileType = (file, allowedTypes = []) => {
  if (!file) return 'File is required';
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return `File type must be one of: ${allowedTypes.join(', ')}`;
  }
  return '';
};

export const validateForm = (formData, validationRules) => {
  const errors = {};
  Object.keys(validationRules).forEach((fieldName) => {
    const rule = validationRules[fieldName];
    const error = rule(formData[fieldName]);
    if (error) {
      errors[fieldName] = error;
    }
  });
  return errors;
};

export const hasFormErrors = (errors) => {
  return Object.values(errors).some((error) => error);
};

// Alias for register page compatibility
export const validatePasswordConfirm = (password, confirmPassword) => {
  return validateConfirmPassword(password, confirmPassword);
};

export default {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
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
  hasFormErrors,
};
