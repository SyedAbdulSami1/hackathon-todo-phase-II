import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// ============================================
// CSS Utility Functions
// ============================================

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ============================================
// String Utilities
// ============================================

/**
 * Capitalize the first letter of a string
 */
export function capitalize(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Format date to readable format
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateString
  }
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()

    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMinutes < 1) return 'just now'
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return formatDate(dateString)
  } catch {
    return dateString
  }
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// ============================================
// Validation Utilities
// ============================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
export function isStrongPassword(password: string): boolean {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

/**
 * Check if a string is empty or whitespace only
 */
export function isEmpty(str: string | null | undefined): boolean {
  return !str || str.trim() === ''
}

// ============================================
// Async Utilities
// ============================================

/**
 * Debounce function to limit how often a function can be called
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Throttle function to limit how often a function can be called
 */
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// ============================================
// Array Utilities
// ============================================

/**
 * Remove duplicates from array
 */
export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)]
}

/**
 * Group array by key
 */
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((groups, item) => {
    const group = String(item[key])
    if (!groups[group]) {
      groups[group] = []
    }
    groups[group].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

/**
 * Paginate array
 */
export function paginate<T>(arr: T[], page: number, limit: number): {
  data: T[]
  total: number
  totalPages: number
  page: number
} {
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const data = arr.slice(startIndex, endIndex)

  return {
    data,
    total: arr.length,
    totalPages: Math.ceil(arr.length / limit),
    page,
  }
}

// ============================================
// Local Storage Utilities
// ============================================

/**
 * Safely get item from localStorage
 */
export function getLocalStorage<T>(key: string, defaultValue?: T): T | null {
  if (typeof window === 'undefined') return defaultValue || null

  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue || null
  } catch {
    return defaultValue || null
  }
}

/**
 * Safely set item to localStorage
 */
export function setLocalStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

/**
 * Remove item from localStorage
 */
export function removeLocalStorage(key: string): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing from localStorage:', error)
  }
}

// ============================================
// File Utilities
// ============================================

/**
 * Convert file size to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Check if file is an image
 */
export function isImage(file: File): boolean {
  return file.type.startsWith('image/')
}

/**
 * Check if file is a video
 */
export function isVideo(file: File): boolean {
  return file.type.startsWith('video/')
}

// ============================================
// Color Utilities
// ============================================

/**
 * Generate a random color
 */
export function getRandomColor(): string {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

// ============================================
// URL Utilities
// ============================================

/**
 * Build query string from object
 */
export function buildQueryParams(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value))
    }
  })

  return searchParams.toString()
}

/**
 * Parse query string to object
 */
export function parseQueryParams(search: string): Record<string, string> {
  const params = new URLSearchParams(search)
  const result: Record<string, string> = {}

  for (const [key, value] of params.entries()) {
    result[key] = value
  }

  return result
}