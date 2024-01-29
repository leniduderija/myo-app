import { describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import { RouteNames } from '@/router'
import App from '@/App.vue'
import UsersView from '@/views/UsersView.vue'
import { mockRouter } from '@/common/tests/setup-tests'

describe('App main layout', async () => {
  test(`navigates to ${RouteNames.USERS} route`, async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [mockRouter]
      }
    })

    const nav = wrapper.find('nav')
    const navLinks = nav.findAll('a')
    const usersLink = navLinks[1]
    expect(usersLink.html()).toContain('Users')
    await usersLink.trigger('click')

    // navigate to route
    await mockRouter.push('/users')
    await mockRouter.isReady()
    expect(wrapper.findComponent(UsersView).exists()).toBe(true)
  })
})
