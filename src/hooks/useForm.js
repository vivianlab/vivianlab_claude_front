import { useState, useCallback } from 'react';
import { clearFieldError } from '../utils/validation/authValidation';

/**
 * Custom hook for form state management
 * @param {Object} initialValues - Initial form values
 * @param {Function} validationFunction - Function to validate form data
 * @returns {Object} Form state and handlers
 */
export const useForm = (initialValues, validationFunction) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({});

  /**
   * Handle input change
   * @param {Event} e - Input change event
   */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => clearFieldError(prev, name));
    }

    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  }, [errors]);

  /**
   * Handle input blur
   * @param {Event} e - Input blur event
   */
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate single field
    if (validationFunction) {
      const fieldErrors = validationFunction({ [name]: formData[name] });
      if (fieldErrors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: fieldErrors[name]
        }));
      }
    }
  }, [formData, validationFunction]);

  /**
   * Validate entire form
   * @returns {boolean} True if form is valid
   */
  const validateForm = useCallback(() => {
    if (!validationFunction) return true;
    
    const newErrors = validationFunction(formData);
    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0;
  }, [formData, validationFunction]);

  /**
   * Reset form to initial values
   */
  const resetForm = useCallback(() => {
    setFormData(initialValues);
    setErrors({});
    setTouched({});
    setIsLoading(false);
  }, [initialValues]);

  /**
   * Set form data
   * @param {Object} data - New form data
   */
  const setFormDataValue = useCallback((data) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
  }, []);

  /**
   * Set specific error
   * @param {string} field - Field name
   * @param {string} error - Error message
   */
  const setError = useCallback((field, error) => {
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  }, []);

  /**
   * Set general error
   * @param {string} error - General error message
   */
  const setGeneralError = useCallback((error) => {
    setErrors(prev => ({
      ...prev,
      general: error
    }));
  }, []);

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * Check if field has error
   * @param {string} fieldName - Field name
   * @returns {boolean} True if field has error
   */
  const hasError = useCallback((fieldName) => {
    return !!(errors[fieldName] && touched[fieldName]);
  }, [errors, touched]);

  /**
   * Get field error
   * @param {string} fieldName - Field name
   * @returns {string} Error message
   */
  const getFieldError = useCallback((fieldName) => {
    return errors[fieldName] || '';
  }, [errors]);

  /**
   * Check if form is valid
   * @returns {boolean} True if form has no errors
   */
  const isValid = useCallback(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  return {
    // State
    formData,
    errors,
    isLoading,
    touched,
    
    // Handlers
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    
    // Setters
    setFormData: setFormDataValue,
    setError,
    setGeneralError,
    clearErrors,
    setIsLoading,
    
    // Getters
    hasError,
    getFieldError,
    isValid
  };
}; 