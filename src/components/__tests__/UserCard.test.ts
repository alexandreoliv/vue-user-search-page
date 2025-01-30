import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import UserCard from '../UserCard.vue'
import { users } from './testUsers'
import type { User } from '../../types'

const userItem: User = users[0]

describe('UserCard.vue', () => {
  it('renders correctly with props', () => {
    const wrapper = mount(UserCard, {
      props: { userItem },
    })

    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('john.doe@example.com')
    expect(wrapper.find('img').attributes('src')).toBe(
      'https://randomuser.me/api/portraits/thumb/men/1.jpg',
    )
  })

  it('toggles favourite status when button clicked', async () => {
    const wrapper = mount(UserCard, {
      props: { userItem },
    })

    const button = wrapper.find('button')
    await button.trigger('click')

    expect(wrapper.emitted().favouriteToggle).toBeTruthy()
    expect(wrapper.emitted().favouriteToggle[0][0].favourite).toBe(true)
  })

  it('adds a new tag and emits updateTags event', async () => {
    const wrapper = mount(UserCard, {
      props: { userItem },
    })

    const input = wrapper.find('.new-tag-input')
    await input.setValue('newTag')
    await input.trigger('keyup.enter')

    expect(wrapper.emitted().updateTags).toBeTruthy()
    expect(wrapper.emitted().updateTags[0][0].tags).toContain('newTag')
  })

  it('removes a tag and emits updateTags event', async () => {
    // Create a copy of userItem and add 'tag1' to the tags array
    const userItemWithTag = {
      ...userItem,
      tags: ['tag1'],
    }

    const wrapper = mount(UserCard, {
      props: { userItem: userItemWithTag },
    })

    const removeButton = wrapper.find('.delete-tag')
    await removeButton.trigger('click')

    expect(wrapper.emitted().updateTags).toBeTruthy()
    expect(wrapper.emitted().updateTags[0][0].tags).not.toContain('tag1')
  })

  it('edits a tag and emits updateTags event', async () => {
    const wrapper = mount(UserCard, {
      props: { userItem },
    })

    const tagText = wrapper.find('.tag span')
    await tagText.trigger('click') // Activate input field

    const input = wrapper.find('.tag input')
    await input.setValue('editedTag')
    await input.trigger('blur')

    expect(wrapper.emitted().updateTags).toBeTruthy()
    expect(wrapper.emitted().updateTags[0][0].tags).toContain('editedTag')
  })
})
