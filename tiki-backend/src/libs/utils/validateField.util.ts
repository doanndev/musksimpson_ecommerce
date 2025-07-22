interface ValidationError {
  [key: string]: string;
}

const validateField = (value: string, field: string): ValidationError => {
  const errors: ValidationError = {};

  if (!value) {
    errors[field] = `${field} is required`;
    return errors;
  }

  switch (field) {
    case 'username':
      if (value.length < 3) {
        errors[field] = 'Username must be at least 3 characters';
      }
      break;
    case 'email':
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors[field] = 'Invalid email format';
      }
      break;
    case 'password':
      if (value.length < 6) {
        errors[field] = 'Password must be at least 6 characters';
      }
      break;
    default:
      break;
  }

  return errors;
};

export default validateField;
