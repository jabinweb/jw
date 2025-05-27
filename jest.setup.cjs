require('@testing-library/jest-dom')

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return ''
  },
}))

// Global mock for Next.js Image (can be overridden in specific test files)
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    const React = require('react')
    // Filter out Next.js specific props
    const { priority, quality, placeholder, blurDataURL, onLoad, onError, ...domProps } = props
    return React.createElement('img', domProps)
  },
}))

// Mock CSS imports
jest.mock('*.css', () => ({}))
jest.mock('*.scss', () => ({}))

// Fix for TextEncoder/TextDecoder in jsdom
const { TextEncoder, TextDecoder } = require('util')
Object.assign(global, { TextEncoder, TextDecoder })

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() { return null }
  disconnect() { return null }
  unobserve() { return null }
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() { return null }
  disconnect() { return null }
  unobserve() { return null }
}
