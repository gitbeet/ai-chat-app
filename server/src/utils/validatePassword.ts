export const validatePassword = (password: string) => {
  if (!/[A-Z]/.test(password))
    return { error: "Password must contain at least one upper case character" };
  if (!/[a-z]/.test(password))
    return { error: "Password must contain at least one lower case character" };
  if (!/[0-9]/.test(password))
    return { error: "Password must contain at least one digit" };
  if (/[`'"\\/<>|&]/.test(password))
    return { error: "Password contains disallowed special characters" };
  if (!/[!@#$%^&*()_+=[\]{}:;,.?-]/.test(password))
    return { error: "Password must contain at least one special character" };
  return { success: true };
};
