import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import UserDetails from '../UserDetails.vue'
import type { User } from '../../types'

const selectedUser: User = {
  name: { first: 'Jane', last: 'Doe' },
  email: 'jane.doe@example.com',
  picture: { large: 'path/to/large-thumbnail.jpg' },
  favourite: true,
  login: { uuid: '12345' },
  location: { city: 'New York', country: 'USA' },
  phone: '123-456-7890',
  tags: ['tagA', 'tagB'],
}

describe('UserDetails.vue', () => {
  it('renders user details correctly', () => {
    const wrapper = mount(UserDetails, {
      props: { selectedUser },
    })

    expect(wrapper.text()).toContain('Jane Doe')
    expect(wrapper.text()).toContain('🆔 12345')
    expect(wrapper.text()).toContain('📍 New York, USA')
    expect(wrapper.text()).toContain('✉️ jane.doe@example.com')
    expect(wrapper.text()).toContain('📞 123-456-7890')
    expect(wrapper.text()).toContain('tagA')
    expect(wrapper.text()).toContain('tagB')
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
