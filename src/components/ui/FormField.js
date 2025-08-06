import React from 'react';
import {
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';

/**
 * Reusable form field component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Form field component
 */
const FormField = ({
  name,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  helperText,
  required = false,
  fullWidth = true,
  autoComplete,
  autoFocus = false,
  disabled = false,
  startIcon,
  endIcon,
  endIconAction,
  showPasswordToggle = false,
  onPasswordToggle,
  showPassword = false,
  ...otherProps
}) => {
  // Handle password visibility toggle
  const handlePasswordToggle = () => {
    if (onPasswordToggle) {
      onPasswordToggle();
    }
  };

  // Build input props
  const inputProps = {};

  // Add start adornment if icon provided
  if (startIcon) {
    inputProps.startAdornment = (
      <InputAdornment position="start">
        {startIcon}
      </InputAdornment>
    );
  }

  // Add end adornment for password toggle or custom icon
  if (showPasswordToggle || endIcon) {
    inputProps.endAdornment = (
      <InputAdornment position="end">
        {showPasswordToggle ? (
          <IconButton
            aria-label="toggle password visibility"
            onClick={handlePasswordToggle}
            edge="end"
          >
            {showPassword ? endIcon : endIcon}
          </IconButton>
        ) : (
          endIconAction ? (
            <IconButton
              onClick={endIconAction}
              edge="end"
            >
              {endIcon}
            </IconButton>
          ) : (
            endIcon
          )
        )}
      </InputAdornment>
    );
  }

  return (
    <TextField
      name={name}
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={!!error}
      helperText={error || helperText}
      required={required}
      fullWidth={fullWidth}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      disabled={disabled}
      InputProps={inputProps}
      margin="normal"
      variant="outlined"
      {...otherProps}
    />
  );
};

export default FormField; 