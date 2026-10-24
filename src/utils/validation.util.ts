export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function validateName(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed === '') {
    return 'Name is required.';
  }
  if (trimmed.length < 3) {
    return 'Name must be at least 3 characters.';
  }
  if (trimmed.length > 20) {
    return 'Name must not exceed 20 characters.';
  }
  if (/^[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(trimmed[0])) {
    return 'Name must start with a letter.';
  }
  return null;
}

export function validateEmail(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed === '') {
    return 'Email is required.';
  }
  if (!isValidEmail(trimmed)) {
    return 'Enter a valid email address (e.g., user@example.com).';
  }
  return null;
}

export function validatePassword(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed === '') {
    return 'Password is required.';
  }
  if (trimmed.length < 8) {
    return 'Password must be at least 8 characters.';
  }
  if (!/[A-Z]/.test(trimmed)) {
    return 'Password must contain at least one uppercase letter.';
  }
  if (!/[a-z]/.test(trimmed)) {
    return 'Password must contain at least one lowercase letter.';
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(trimmed)) {
    return 'Password must contain at least one special character.';
  }
  return null;
}

export function validateRegisterInput(input: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}): string | null {
  const nameError = validateName(input.name);
  if (nameError) return nameError;

  const emailError = validateEmail(input.email);
  if (emailError) return emailError;

  const passwordError = validatePassword(input.password);
  if (passwordError) return passwordError;

  if (input.password !== input.confirmPassword) {
    return 'Passwords do not match.';
  }
  return null;
}

export function validateLoginInput(input: { email: string; password: string }): string | null {
  const emailError = validateEmail(input.email);
  if (emailError) return emailError;

  if (input.password.trim() === '') {
    return 'Password is required.';
  }
  return null;
}

export function validateOriginalUrl(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed === '') {
    return 'URL is required.';
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return 'URL must use http or https.';
    }
  } catch {
    return 'Enter a valid URL (e.g., https://example.com).';
  }
  return null;
}
