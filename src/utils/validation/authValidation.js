import { VALIDATION_RULES, ERROR_MESSAGES } from '../../constants/validation';

/**
 * Validates email format and requirements
 * @param {string} email - Email to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateEmail = (email) => {
  const { EMAIL } = VALIDATION_RULES;
  const { EMAIL: EMAIL_ERRORS } = ERROR_MESSAGES;

  if (!email) {
    return EMAIL_ERRORS.REQUIRED;
  }

  if (email.length < EMAIL.MIN_LENGTH) {
    return EMAIL_ERRORS.TOO_SHORT;
  }

  if (email.length > EMAIL.MAX_LENGTH) {
    return EMAIL_ERRORS.TOO_LONG;
  }

  if (!EMAIL.PATTERN.test(email)) {
    return EMAIL_ERRORS.INVALID;
  }

  return null;
};

/**
 * Validates password strength and requirements
 * @param {string} password - Password to validate
 * @returns {string|null} Error message or null if valid
 */
export const validatePassword = (password) => {
  const { PASSWORD } = VALIDATION_RULES;
  const { PASSWORD: PASSWORD_ERRORS } = ERROR_MESSAGES;

  if (!password) {
    return PASSWORD_ERRORS.REQUIRED;
  }

  if (password.length < PASSWORD.MIN_LENGTH) {
    return PASSWORD_ERRORS.TOO_SHORT;
  }

  if (password.length > PASSWORD.MAX_LENGTH) {
    return PASSWORD_ERRORS.TOO_LONG;
  }

  if (!PASSWORD.PATTERN.test(password)) {
    return PASSWORD_ERRORS.WEAK;
  }

  return null;
};

/**
 * Validates password confirmation
 * @param {string} confirmPassword - Confirmation password
 * @param {string} password - Original password
 * @returns {string|null} Error message or null if valid
 */
export const validateConfirmPassword = (confirmPassword, password) => {
  const { CONFIRM_PASSWORD: CONFIRM_ERRORS } = ERROR_MESSAGES;

  if (!confirmPassword) {
    return CONFIRM_ERRORS.REQUIRED;
  }

  if (confirmPassword !== password) {
    return CONFIRM_ERRORS.MISMATCH;
  }

  return null;
};

/**
 * Validates login form data
 * @param {Object} formData - Form data object
 * @returns {Object} Object containing validation errors
 */
export const validateLoginForm = (formData) => {
  const errors = {};

  const emailError = validateEmail(formData.email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(formData.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
};

/**
 * Validates registration form data
 * @param {Object} formData - Form data object
 * @returns {Object} Object containing validation errors
 */
export const validateRegisterForm = (formData) => {
  const errors = {};

  const emailError = validateEmail(formData.email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(formData.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.password);
  if (confirmPasswordError) {
    errors.confirmPassword = confirmPasswordError;
  }

  return errors;
};

/**
 * Checks if form has any validation errors
 * @param {Object} errors - Validation errors object
 * @returns {boolean} True if form is valid
 */
export const isFormValid = (errors) => {
  return Object.keys(errors).length === 0;
};

/**
 * Clears specific field error when user starts typing
 * @param {Object} errors - Current errors object
 * @param {string} fieldName - Field name to clear error for
 * @returns {Object} Updated errors object
 */
export const clearFieldError = (errors, fieldName) => {
  if (errors[fieldName]) {
    const newErrors = { ...errors };
    delete newErrors[fieldName];
    return newErrors;
  }
  return errors;
}; 