import { describe, expect, it, vi } from 'vitest'
import UserView from '../UserView.vue'
import usersService from '../../common/services/users-service'
import { usersMock } from '../../common/tests/__mocks__/users.mock'
import { mount } from '@vue/test-utils'
import router, { RouteNames } from '../../router'

const mocks = vi.hoisted(() => ({
  get: vi.fn(() => Promise.resolve({ data: usersMock[0] })),
  post: vi.fn(),
  put: vi.fn(() =>
    Promise.resolve({
      ...firstUser,
      username: editedValue.username
    })
  ),
  delete: vi.fn(),
  reset: () => {
    mocks.get.mockReset()
    mocks.post.mockReset()
    mocks.put.mockReset()
    mocks.delete.mockReset()
  }
}))

vi.mock('axios', async (importActual) => {
  const actual = await importActual<typeof import('axios')>()

  const mockAxios = {
    default: {
      ...actual.default,
      create: vi.fn(() => ({
        ...actual.default.create(),
        get: mocks.get,
        post: mocks.post,
        put: mocks.put,
        delete: mocks.delete
      }))
    }
  }
  return mockAxios
})

const firstUser = usersMock[0]

const editedValue = {
  username: 'John Doe Edited',
  firstName: 'Johnic',
  lastName: 'Doeic',
  avatar: 'www.google.com'
}

const wrapper = mount(UserView, {
  global: {
    plugins: [router]
  }
})

// Mock the notification component

describe('User details page', () => {
  it('should update user data', async () => {
    // Navigate to the user page
    await router.push({
      name: RouteNames.USER_DETAILS,
      params: { userId: firstUser.id }
    })

    await router.isReady()

    await wrapper.vm.$nextTick()

    // Assert that the user data is rendered
    expect(wrapper.text()).toContain(firstUser.username)

    const enableEdit = wrapper.find('[data-testid="enable-update"]')
    await enableEdit.trigger('click')

    const inputs = wrapper.findAll('input[type="text"]')
    const usernameInput = inputs[0]
    await usernameInput.setValue(editedValue.username)

    const updateBtn = wrapper.find('[data-testid="update-button"]')
    await updateBtn.trigger('click')

    await usersService.updateUser({
      ...firstUser,
      username: editedValue.username
    })

    // Assert that the user profile was updated successfully
    expect(mocks.put).toHaveBeenCalledWith(`/api/users/${firstUser.id}`, {
      ...firstUser,
      username: editedValue.username
    })

    // TODO Leni 29/01: Add check for successful notification message
  })
  it('should hide enable edit icon when query param edit=true', async () => {})
  it('should show error notification when user update fails', async () => {})
})
