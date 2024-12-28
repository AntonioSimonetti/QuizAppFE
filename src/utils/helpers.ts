const truncateTitle = (title: string, maxLength: number = 20) => {
    return title.length > maxLength ? title.slice(0, maxLength) + '...' : title;
};

  
  export default truncateTitle;

  export const truncateText = (text: string, maxLength: number = 17): string => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

export const validateEmail = (email: string): string | null => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!email) {
        return 'Email is required';
    }
    
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }
    
    return null;
};

// Funzione di validazione per la password
export const validatePassword = (password: string) => {
  // Regex per validare una password
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
  if (!password) {
      return "Password is required";
  }
  if (password.length < 8) {
      return "Password must be at least 8 characters long";
  }
  if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one special character";
  }
  if (!passwordRegex.test(password)) {
      return "Password must meet all requirements: at least 8 characters, one uppercase letter, and one special character";
  }
  return null; // Nessun errore
};

// Funzione per validare la conferma della password
export const validateConfirmPassword = (password: string, confirmPassword: string) => {
  if (!confirmPassword) {
      return "Please confirm your password";
  }
  if (password !== confirmPassword) {
      return "Passwords do not match";
  }
  return null;
};
