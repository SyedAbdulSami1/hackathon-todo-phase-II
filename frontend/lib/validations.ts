import { z } from 'zod'
import type { Task, CreateTaskRequest, UpdateTaskRequest } from '@/types'

// ============================================
// Common Validation Schemas
// ============================================

export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  )

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')

export const titleSchema = z
  .string()
  .min(1, 'Title is required')
  .max(200, 'Title must be less than 200 characters')

export const descriptionSchema = z
  .string()
  .max(1000, 'Description must be less than 1000 characters')
  .optional()
  .nullable()

// ============================================
// Task Validation Schemas
// ============================================

export const createTaskSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
})

export const updateTaskSchema = z.object({
  title: titleSchema.optional(),
  description: descriptionSchema,
  completed: z.boolean().optional(),
})

export const taskFilterSchema = z.object({
  status: z.enum(['all', 'pending', 'completed']),
  sort: z.enum(['created', 'title', 'due_date']),
  search: z.string().optional(),
})

// ============================================
// Auth Validation Schemas
// ============================================

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
})

// ============================================
// Form Validation Utilities
// ============================================

/**
 * Validate form data with Zod schema and return errors
 */
export function validateForm<T>(
  data: T,
  schema: z.ZodType<T>
): { success: true; data: T } | { success: false; errors: Record<string, string[]> } {
  const result = schema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  const errors: Record<string, string[]> = {}
  result.error.issues.forEach(issue => {
    const path = issue.path.join('.')
    if (!errors[path]) {
      errors[path] = []
    }
    errors[path].push(issue.message)
  })

  return { success: false, errors }
}

/**
 * Get first error message for a specific field
 */
export function getFieldError(errors: Record<string, string[]>, field: string): string | undefined {
  return errors[field]?.[0]
}

/**
 * Check if a field has any errors
 */
export function hasFieldError(errors: Record<string, string[]>, field: string): boolean {
  return !!errors[field]?.length
}

// ============================================
// Async Validation Utilities
// ============================================

/**
 * Debounce validation for better performance
 */
export function debounceValidation<T>(
  validate: (data: T) => Promise<{ success: boolean; errors?: Record<string, string[]> }>,
  delay: number = 300
) {
  let timeoutId: NodeJS.Timeout

  return async (data: T): Promise<{ success: boolean; errors?: Record<string, string[]> }> => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(async () => {
      return validate(data)
    }, delay)

    // Return immediately for the first validation
    return { success: true }
  }
}

// ============================================
// Password Strength Checker
// ============================================

export function checkPasswordStrength(password: string): {
  score: number
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 0

  // Length check
  if (password.length >= 8) {
    score += 1
  } else {
    feedback.push('Password should be at least 8 characters long')
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1
  } else {
    feedback.push('Include at least one uppercase letter')
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    feedback.push('Include at least one lowercase letter')
  }

  // Number check
  if (/\d/.test(password)) {
    score += 1
  } else {
    feedback.push('Include at least one number')
  }

  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1
  } else {
    feedback.push('Include at least one special character')
  }

  return {
    score,
    feedback,
  }
}

// ============================================
// File Validation
// ============================================

export const maxFileSize = 10 * 1024 * 1024 // 10MB

export const allowedFileTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
]

export function validateFile(file: File): {
  valid: boolean
  error?: string
} {
  if (file.size > maxFileSize) {
    return {
      valid: false,
      error: `File size must be less than ${maxFileSize / (1024 * 1024)}MB`,
    }
  }

  if (!allowedFileTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'File type not allowed. Please upload a JPEG, PNG, GIF, WebP, PDF, or text file.',
    }
  }

  return { valid: true }
}

// ============================================
// URL Validation
// ============================================

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// ============================================
// Phone Number Validation
// ============================================

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number')

// ============================================
// Date Validation
// ============================================

export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date (YYYY-MM-DD)')

export const datetimeSchema = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/,
    'Please enter a valid datetime (YYYY-MM-DDTHH:mm:ss)'
  )

// ============================================
// Generic Field Validators
// ============================================

export const validators = {
  required: (value: any) => {
    if (typeof value === 'string') {
      return value.trim() !== '' || 'This field is required'
    }
    if (value === null || value === undefined) {
      return 'This field is required'
    }
    return true
  },

  minLength: (min: number) => (value: string) => {
    return value.length >= min || `Must be at least ${min} characters`
  },

  maxLength: (max: number) => (value: string) => {
    return value.length <= max || `Must be less than ${max} characters`
  },

  pattern: (regex: RegExp, message: string) => (value: string) => {
    return regex.test(value) || message
  },

  number: (value: any) => {
    return !isNaN(Number(value)) || 'Please enter a valid number'
  },

  integer: (value: any) => {
    return Number.isInteger(Number(value)) || 'Please enter a valid integer'
  },

  positive: (value: any) => {
    return Number(value) > 0 || 'Please enter a positive number'
  },

  email: (value: string) => {
    return emailSchema.safeParse(value).success || 'Please enter a valid email'
  },

  url: (value: string) => {
    return isValidUrl(value) || 'Please enter a valid URL'
  },
}

// ============================================
// Custom Error Messages
// ============================================

export const errorMessages = {
  required: {
    generic: 'This field is required',
    email: 'Please enter your email address',
    password: 'Please enter your password',
    name: 'Please enter your name',
    title: 'Please enter a title',
    content: 'Please enter some content',
  },

  format: {
    email: 'Please enter a valid email address',
    url: 'Please enter a valid URL',
    phone: 'Please enter a valid phone number',
    date: 'Please enter a valid date',
  },

  length: {
    min: (min: number) => `Must be at least ${min} characters`,
    max: (max: number) => `Must be less than ${max} characters`,
    exact: (exact: number) => `Must be exactly ${exact} characters`,
  },

  custom: {
    weakPassword: 'Password is too weak. Please use a stronger password.',
    fileTooLarge: 'File size is too large',
    fileTypeNotAllowed: 'File type is not allowed',
    usernameExists: 'Username is already taken',
    emailExists: 'Email is already registered',
  },
}