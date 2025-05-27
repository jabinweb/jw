import { cn } from '@/lib/utils'

describe('utils', () => {
  describe('cn function', () => {
    it('combines class names correctly', () => {
      const result = cn('class1', 'class2', 'class3')
      expect(result).toBe('class1 class2 class3')
    })

    it('handles conditional classes', () => {
      const condition = true
      const result = cn('base', condition && 'conditional', 'always')
      expect(result).toBe('base conditional always')
    })

    it('filters out falsy values', () => {
      const result = cn('class1', false, null, undefined, '', 'class2')
      expect(result).toBe('class1 class2')
    })

    it('handles objects with conditional classes', () => {
      const result = cn('base', {
        'active': true,
        'inactive': false
      })
      expect(result).toBe('base active')
    })
  })
})
