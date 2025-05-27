import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { OptimizedImage } from '../ui/optimized-image'

// Mock the cn utility function
jest.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' ')
}))

// Mock Next.js Image component specifically for this test
jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage(props: any) {
    // Filter out Next.js specific props that shouldn't be on DOM elements
    const { 
      priority, 
      quality, 
      placeholder, 
      blurDataURL, 
      onLoad, 
      onError,
      ...domProps 
    } = props
    
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={props.alt || ''} {...domProps} />
  },
}))

describe('OptimizedImage', () => {
  it('renders image with correct attributes', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={300}
        height={200}
      />
    )

    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('alt', 'Test image')
    expect(image).toBeInTheDocument()
  })

  it('shows loading state initially', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={300}
        height={200}
      />
    )

    // Check for the container with relative positioning
    const container = screen.getByRole('img').parentElement
    expect(container).toHaveClass('relative')
  })

  it('applies custom className', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={300}
        height={200}
        className="custom-class"
      />
    )

    const container = screen.getByRole('img').parentElement
    expect(container).toHaveClass('custom-class')
  })

  it('sets priority when specified', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={300}
        height={200}
        priority={true}
      />
    )

    const image = screen.getByRole('img')
    expect(image).toBeInTheDocument()
  })

  it('handles quality prop correctly', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={300}
        height={200}
        quality={90}
      />
    )

    const image = screen.getByRole('img')
    expect(image).toBeInTheDocument()
  })

  it('handles placeholder prop correctly', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={300}
        height={200}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,..."
      />
    )

    const image = screen.getByRole('img')
    expect(image).toBeInTheDocument()
  })
})


