export type AccountFormErrors = { email?: string; password?: string };

export function validateAccountForm(
  email: string,
  password: string,
  creatingAccount: boolean,
): AccountFormErrors {
  const errors: AccountFormErrors = {};
  if (!email.trim()) errors.email = "Enter your email address.";
  else if (email.trim().length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    errors.email = "Enter a valid email address.";
  if (!password) errors.password = "Enter your password.";
  else if (creatingAccount && password.length < 10)
    errors.password = "Use at least 10 characters for your password.";
  return errors;
}
