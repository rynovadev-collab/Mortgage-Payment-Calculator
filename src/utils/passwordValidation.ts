import { z } from "zod";

// Strong password requirements
export const strongPasswordSchema = z
  .string()
  .min(12, "Password must be at least 12 characters")
  .max(100, "Password must be less than 100 characters")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character");

export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  errors: string[];
  strength: "weak" | "medium" | "strong" | "very-strong";
} => {
  const errors: string[] = [];
  let score = 0;

  // Length check
  if (password.length < 12) {
    errors.push("Password must be at least 12 characters");
  } else if (password.length >= 12) {
    score += 1;
  }
  
  if (password.length >= 16) {
    score += 1;
  }

  // Character variety checks
  if (!/[a-z]/.test(password)) {
    errors.push("Must contain lowercase letters");
  } else {
    score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Must contain uppercase letters");
  } else {
    score += 1;
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Must contain numbers");
  } else {
    score += 1;
  }

  if (!/[^a-zA-Z0-9]/.test(password)) {
    errors.push("Must contain special characters");
  } else {
    score += 1;
  }

  // Determine strength
  let strength: "weak" | "medium" | "strong" | "very-strong" = "weak";
  if (score >= 6) {
    strength = "very-strong";
  } else if (score >= 5) {
    strength = "strong";
  } else if (score >= 4) {
    strength = "medium";
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
};

// Check for common weak passwords
const commonPasswords = [
  "password123",
  "123456789",
  "qwerty123",
  "admin123",
  "welcome123",
  "letmein123",
];

export const isCommonPassword = (password: string): boolean => {
  const lowerPassword = password.toLowerCase();
  return commonPasswords.some((common) => lowerPassword.includes(common));
};
