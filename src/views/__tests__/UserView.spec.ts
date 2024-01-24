import { beforeEach, describe, expect, test, it, vi } from 'vitest'
import axios, { AxiosResponse } from 'axios'
import UserView from '../UserView.vue'
import usersService from '../../common/services/users-service'
import { usersMock } from './users.mock'
import { mount } from '@vue/test-utils'
import { useRoute, useRouter } from 'vue-router'
import { cleanup, render, within, expect as expectVue } from '@testing-library/vue'
import { User } from '../../shared/type-defs'

const wrapper = mount(UserView)

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  put: vi.fn()
}))

vi.mock('axios', async (importActual) => {
  const actual = await importActual<typeof import('axios')>()

  const mockAxios = {
    default: {
      ...actual.default,
      create: vi.fn(() => ({
        ...actual.default.create(),
        get: mocks.get,
        put: mocks.put
      }))
    }
  }
  return mockAxios
})

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { userId: usersMock[0].id } })
}))

describe('User details page', () => {
  beforeEach(() => {
    mocks.get.mockReset()
  })
  afterEach(() => {
    cleanup()
  })

  describe('User profile data is shown correctly', () => {
    it('should fetch user data', async () => {
      mocks.get.mockResolvedValueOnce({
        data: usersMock[0]
      })
      const route = useRoute()
      const id = String(route.params.userId)

      const getUserSpy = vi.spyOn(usersService, 'getUser')
      const user = await usersService.getUser(id)
      expect(getUserSpy).toHaveBeenCalledOnce()
      expect(getUserSpy).toHaveBeenCalledWith(id)

      expect(mocks.get).toHaveBeenCalled() // should return true
      expect(user).toStrictEqual({ data: usersMock[0] })

      getUserSpy.mockClear()
    })

    it('renders a users card element', async () => {
      mocks.get.mockResolvedValueOnce({ data: usersMock[0] })
      const route = useRoute()
      const id = String(route.params.userId)

      const getUserSpy = vi.spyOn(usersService, 'getUser')
      const user = await usersService.getUser(id).then((r) => r.data)
      // console.log('user ', user)
      const { findByTestId } = render(UserView)
      //
      // console.log('title ', await findByTestId('user-card-title'))
      const title = await findByTestId('user-card-title')
      const { queryByText: queryByTextInTitle, findByText } = within(title)
      const text = await queryByTextInTitle(user.username)
      console.log('TEXT ', text)

      // expect(queryByTextInTitle(user.data.username).text()).toBe(user.data.username)

      // console.log('wrapper  ', wrapper.find('.card-title'))
      // expect(getByTestId('user-card-title').expect.toContain(user.data.username))
      // expect(
      //     getByTestId('user-card-title').children.length
      // ).toBe(items.length);

      // const cardHead = document.querySelector('.ant-card-head')
      // console.log('card head', cardHead)
      // Expect a table element to exist
      // expect(cardHead.text()).toBe(user.username)
      // Expect the table element to have table head
      // expect(wrapper.find('thead').exists()).toBe(true)

      // const tableHeads = await wrapper.findAll('th')
      // expect(tableHeads[0].text()).toBe('Username')
      // expect(tableHeads[1].text()).toBe('First name')
      // expect(tableHeads[2].text()).toBe('Last name')
      // expect(tableHeads[3].text()).toBe('Created At')
      // expect(tableHeads[4].text()).toBe('Action')

      getUserSpy.mockClear()
    })
  })
})
