import { useState, useEffect, useCallback, useRef } from 'react'
import type { ApiError } from '@/types'

// ============================================
// Use Async Hook
// ============================================

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true
) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<ApiError | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const execute = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    setData(null)

    try {
      const result = await asyncFunction()
      setData(result)
    } catch (err) {
      setError(err as ApiError)
    } finally {
      setIsLoading(false)
    }
  }, [asyncFunction])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { execute, data, error, isLoading }
}

// ============================================
// Use Local Storage Hook
// ============================================

export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultValue

    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  })

  const setStoredValue = useCallback((newValue: T) => {
    try {
      setValue(newValue)
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(newValue))
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }, [key])

  return [value, setStoredValue]
}

// ============================================
// Use Debounce Hook
// ============================================

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// ============================================
// Use Click Outside Hook
// ============================================

export function useClickOutside<T extends HTMLElement>(
  callback: () => void
): React.RefObject<T> {
  const ref = useRef<T>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [callback])

  return ref
}

// ============================================
// Use Previous Hook
// ============================================

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  })

  return ref.current
}

// ============================================
// Use Array State Hook
// ============================================

export function useArrayState<T>() {
  const [array, setArray] = useState<T[]>([])

  const set = useCallback((newArray: T[]) => setArray(newArray), [])

  const push = useCallback((item: T) => {
    setArray(prev => [...prev, item])
  }, [])

  const filter = useCallback((callback: (item: T, index: number, array: T[]) => boolean) => {
    setArray(prev => prev.filter(callback))
  }, [])

  const update = useCallback((index: number, newItem: T) => {
    setArray(prev => {
      const newArray = [...prev]
      newArray[index] = newItem
      return newArray
    })
  }, [])

  const remove = useCallback((index: number) => {
    setArray(prev => prev.filter((_, i) => i !== index))
  }, [])

  const clear = useCallback(() => setArray([]), [])

  return { array, set, push, filter, update, remove, clear }
}

// ============================================
// Use Toggle Hook
// ============================================

export function useToggle(initialValue: boolean = false): [boolean, () => void] {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => {
    setValue(v => !v)
  }, [])

  return [value, toggle]
}

// ============================================
// Use Copy to Clipboard Hook
// ============================================

export function useCopyToClipboard(): [boolean, (text: string) => Promise<void>] {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      setIsCopied(false)
      throw error
    }
  }, [])

  return [isCopied, copyToClipboard]
}

// ============================================
// Use Intersection Observer Hook
// ============================================

export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options?: IntersectionObserverInit
) {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [elementRef, options])

  return isIntersecting
}

// ============================================
// Use Window Size Hook
// ============================================

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

// ============================================
// Use Before Unload Hook
// ============================================

export function useBeforeUnload(message: string) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = message
      return message
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [message])
}

// ============================================
// Use Idle Hook
// ============================================

export function useIdle(timeout: number = 5000) {
  const [isIdle, setIsIdle] = useState(false)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleActivity = () => {
      setIsIdle(false)
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => setIsIdle(true), timeout)
    }

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true)
    })

    timeoutId = setTimeout(() => setIsIdle(true), timeout)

    return () => {
      clearTimeout(timeoutId)
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true)
      })
    }
  }, [timeout])

  return isIdle
}

// ============================================
// Use Focus Trap Hook
// ============================================

export function useFocusTrap(elementRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus()
          e.preventDefault()
        }
      }
    }

    element.addEventListener('keydown', handleKeyDown)
    firstElement?.focus()

    return () => {
      element.removeEventListener('keydown', handleKeyDown)
    }
  }, [elementRef])
}