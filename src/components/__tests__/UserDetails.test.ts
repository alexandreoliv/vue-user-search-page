import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import UserDetails from '../UserDetails.vue'
import { users } from './testUsers'
import type { User } from '../../types'

const selectedUser: User = users[0]

describe('UserDetails.vue', () => {
  it('renders user details correctly', () => {
    const wrapper = mount(UserDetails, {
      props: { selectedUser },
    })

    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('🆔 1')
    expect(wrapper.text()).toContain('📍 New York, USA')
    expect(wrapper.text()).toContain('✉️ john.doe@example.com')
    expect(wrapper.text()).toContain('📞 (555) 123-4567')
    expect(wrapper.text()).toContain('tag1')
    expect(wrapper.text()).toContain('tag2')
  })
})

it('emits close event when close button is clicked', async () => {
  const wrapper = mount(UserDetails, {
    props: { selectedUser },
  })

  const closeButton = wrapper.find('.close-button')
  await closeButton.trigger('click')

  expect(wrapper.emitted().close).toBeTruthy()
})
