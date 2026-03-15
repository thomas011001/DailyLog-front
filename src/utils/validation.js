/**
 * Validation utilities for form fields
 */

export const validators = {
  username: (value) => {
    if (!value || value.trim() === "") {
      return "Username is required";
    }
    if (value.length < 3) {
      return "Username must be at least 3 characters";
    }
    if (value.length > 20) {
      return "Username must be at most 20 characters";
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      return "Username can only contain letters, numbers, hyphens, and underscores";
    }
    return "";
  },

  password: (value) => {
    if (!value) {
      return "Password is required";
    }
    if (value.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (value.length > 128) {
      return "Password must be at most 128 characters";
    }
    return "";
  },

  repeatPassword: (password, repeatPassword) => {
    if (!repeatPassword) {
      return "Please confirm your password";
    }
    if (password !== repeatPassword) {
      return "Passwords do not match";
    }
    return "";
  },
};

export const validateSignUpForm = (formData) => {
  const errors = {};

  errors.username = validators.username(formData.username);
  errors.password = validators.password(formData.password);
  errors.repeatPassword = validators.repeatPassword(
    formData.password,
    formData.repeatPassword,
  );

  return {
    errors,
    isValid: !Object.values(errors).some((error) => error !== ""),
  };
};

export const validateLoginForm = (formData) => {
  const errors = {};

  if (!formData.username || formData.username.trim() === "") {
    errors.username = "Username is required";
  }
  if (!formData.password) {
    errors.password = "Password is required";
  }

  return {
    errors,
    isValid: !Object.values(errors).some((error) => error !== ""),
  };
};
