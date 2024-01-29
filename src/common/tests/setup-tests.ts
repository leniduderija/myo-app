// Extend the global object with custom matchers
import { vi } from 'vitest'
import { usersMock } from '@/common/tests/__mocks__/users.mock'

declare global {
  namespace vi {
    interface Matchers<R> {
      toBeInTheDocument(): R
    }
  }
}

// Add type declarations for custom matchers
declare module '@testing-library/vue' {
  interface HTMLElement {
    toBeInTheDocument(): void
  }
}

// TODO Leni 2801: Use this http client mock, add mock data where necessary
const mocks = vi.hoisted(() => ({
  get: vi.fn(() => Promise.resolve({ data: usersMock })),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  reset: () => {
    mocks.get.mockReset()
    mocks.post.mockReset()
    mocks.put.mockReset()
    mocks.delete.mockReset()
  }
}))
