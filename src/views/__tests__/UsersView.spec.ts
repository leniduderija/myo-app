import { describe, expect, it, vi } from 'vitest'
import UsersView from '../UsersView.vue'
import usersService from '../../common/services/users-service'
import { usersMock } from '../../common/tests/__mocks__/users.mock'
import { mount } from '@vue/test-utils'
import router from '../../router'
import { getActionsCellButtons } from '../../common/tests/test-utils'
import { render } from '@testing-library/vue'
import { Popconfirm } from 'ant-design-vue'

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

const wrapper = mount(UsersView, {
  global: {
    plugins: [router]
  }
})

const firstUser = usersMock[0]

describe('Users page', async () => {
  describe('Users table is shown correctly with edit and delete actions', () => {
    it('renders a users table element', async () => {
      const getUsersSpy = vi.spyOn(usersService, 'getUsers')
      await usersService.getUsers()
      expect(mocks.get).toHaveBeenCalledWith('/api/users')

      expect(getUsersSpy).toHaveBeenCalledOnce()
      expect(mocks.get).toHaveBeenCalled() // should return true

      expect(wrapper.find('table').exists()).toBe(true)

      const tableHeads = await wrapper.findAll('th')
      expect(tableHeads[0].text()).toBe('Username')
      expect(tableHeads[1].text()).toBe('First name')
      expect(tableHeads[2].text()).toBe('Last name')
      expect(tableHeads[3].text()).toBe('Created At')
      expect(tableHeads[4].text()).toBe('Action')
    })

    it('should fetch users', async () => {
      mocks.get.mockResolvedValueOnce({
        data: usersMock
      })
      const getUsersSpy = vi.spyOn(usersService, 'getUsers')
      const users = await usersService.getUsers()
      expect(getUsersSpy).toHaveBeenCalledOnce()
      expect(mocks.get).toHaveBeenCalledWith('/api/users')
      expect(mocks.get).toHaveBeenCalled()
      expect(users).toStrictEqual({ data: usersMock })
    })

    it('should show users in table', async () => {
      const getUsersSpy = vi.spyOn(usersService, 'getUsers')
      const users = await usersService.getUsers()
      expect(mocks.get).toHaveBeenCalledWith('/api/users')
      expect(getUsersSpy).toHaveBeenCalledOnce()
      expect(users).toStrictEqual({ data: usersMock })

      // Ensure the table rows are rendered with correct data
      const tableRows = await wrapper.findAll('tbody tr')

      // Ensure each row contains the correct user data
      tableRows.forEach((row, index) => {
        const user = usersMock[index]
        const cells = row.findAll('td')
        expect(cells.length).toBe(5) // 5 columns (username, first name, last name, created at, action)
        expect(cells[0].text()).toBe(user.username)
        expect(cells[1].text()).toBe(user.profile.firstName)
        expect(cells[2].text()).toBe(user.profile.lastName)
        expect(cells[3].text()).toBe(new Date(user.createdAt).toLocaleDateString())
      })
    })

    it(`navigates to users route and sets query parameter edit equal to 'true'`, async () => {
      await usersService.getUsers()

      // Ensure the table rows are rendered with correct data
      const actionBtns = await getActionsCellButtons(wrapper)
      const editBtn = actionBtns[0]

      const push = vi.spyOn(router, 'push')

      expect(editBtn.html()).toContain('Edit')
      await editBtn.trigger('click')

      expect(wrapper.findComponent(UsersView).exists()).toBe(true)

      expect(push).toHaveBeenCalledTimes(1)
      expect(push).toHaveBeenCalledWith(`/users/${firstUser.id}?edit=true`)
    })

    it('opens prompt for deleting user when clicking delete button', async () => {
      const { getByText, queryByRole, getByRole } = render(Popconfirm, {
        slots: {
          title: `Are you sure you want to delete ${firstUser.username}?`,
          default: 'Delete',
          confirm: 'Ok',
          cancel: 'Cancel'
        }
      })

      await usersService.getUsers()
      const deleteUserSpy = vi.spyOn(usersService, 'deleteUser')

      const actionBtns = await getActionsCellButtons(wrapper)
      const deleteBtn = actionBtns[1]

      expect(deleteBtn.html()).toContain('Delete')
      await deleteBtn.trigger('click')

      const triggerButton = getByText('Delete')
      await triggerButton.click()

      // Assert: Check that the Popconfirm is visible
      const popconfirm = getByRole('tooltip')
      // expect(popconfirm).toBeInTheDocument();
      // TODO Leni 28/01: popover is not showing, find out why! Write rest of the test - confirm action, mocks.delete api call

      expect(deleteUserSpy).toHaveBeenCalledOnce()
      expect(mocks.delete).toHaveBeenCalledWith(`/api/users/${firstUser.id}`)
      expect(mocks.delete).toHaveBeenCalled()
    })
  })
})
