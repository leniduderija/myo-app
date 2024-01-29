import { vi } from 'vitest'

const mockedHttp = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
  head: vi.fn(),
  reset: () => {
    mockedHttp.get.mockReset()
    mockedHttp.post.mockReset()
    mockedHttp.put.mockReset()
    mockedHttp.patch.mockReset()
    mockedHttp.delete.mockReset()
    mockedHttp.head.mockReset()
  }
}

export const http = mockedHttp
