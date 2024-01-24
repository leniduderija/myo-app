import { beforeEach, describe, expect, test, it, vi } from 'vitest'
import axios from 'axios'
import UsersView from '../UsersView.vue'
import usersService from '../../common/services/users-service'
import { usersMock } from './users.mock'
import { mount } from '@vue/test-utils'

const wrapper = mount(UsersView)

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn()
}))

vi.mock('axios', async (importActual) => {
  const actual = await importActual<typeof import('axios')>()

  const mockAxios = {
    default: {
      ...actual.default,
      create: vi.fn(() => ({
        ...actual.default.create(),
        get: mocks.get,
        post: mocks.post
      }))
    }
  }
  return mockAxios
})

describe('Users page', () => {
  beforeEach(() => {
    mocks.get.mockReset()
  })

  describe('Users table is shown correctly', () => {
    it('renders a users table element', async () => {
      // Expect a table element to exist
      expect(wrapper.find('table').exists()).toBe(true)
      // Expect the table element to have table head
      expect(wrapper.find('thead').exists()).toBe(true)

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
      expect(mocks.get).toHaveBeenCalled() // should return true
      expect(users).toStrictEqual({ data: usersMock })
    })

    it('should show users in table', async () => {
      mocks.get.mockResolvedValueOnce({
        data: usersMock
      })
      const getUsersSpy = vi.spyOn(usersService, 'getUsers')
      const users = await usersService.getUsers()
      expect(getUsersSpy).toHaveBeenCalledOnce()
      expect(mocks.get).toHaveBeenCalled() // should return true
      expect(users).toStrictEqual({ data: usersMock })

      const tBody = await wrapper.find('tbody')
      const tableRows = await tBody.findAll('tr')
      const firstRow = tableRows[0]
      const tableCells = await firstRow.findAll('td')
      console.log("wrapper.find('table') ", wrapper.find('table'))
      // expect(tableCells[0].text()).toBe(usersMock[0].username)
      // mocks.get.mockResolvedValueOnce({
      //   data: usersMock
      // })
      // const getUsersSpy = vi.spyOn(usersService, 'getUsers')
      // const users = await usersService.getUsers()
      // expect(getUsersSpy).toHaveBeenCalledOnce()
      // expect(mocks.get).toHaveBeenCalled() // should return true
      // expect(users).toStrictEqual({ data: usersMock })
    })

    test(`navigates to users route and sets query parameter name equal to 'John Doe'`, async () => {
      // const wrapper = shallowMount(Home)
      //
      // await wrapper.find('button').trigger('click')
      //
      // expect(something_to_happen)
    })

    // it('renders the submit text correctly', () => {
    //   const wrapper = mount(BaseForm, {
    //     props: {
    //       submitText: 'Submit'
    //     }
    //   })
    //
    //   // Expect the submit button to have the correct text
    //   expect(wrapper.find('button').text()).toBe('Submit')
    // })

    // test('makes a GET request to fetch users', async () => {
    //   httpClient.get.mockResolvedValue({
    //     data: usersMock
    //   })
    //   const users = usersService.getUsers()
    //
    //   expect(httpClient.get).toHaveBeenCalledWith(import.meta.env.VITE_API_BASE_URL + '/api/users')
    //   expect(users).toStrictEqual(usersMock)
    // })
  })
})

// describe('User details page', () => {
//   it('users page renders properly', async () => {
//     expect(UserView).toBeTruthy()
//
//     // const wrapper = mount(UserView, {})
//     // const table = await wrapper.get('table')
//     // expect(table).toBeTruthy()
//   })
// })
