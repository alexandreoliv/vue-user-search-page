import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import UserList from '../UserList.vue'
import UserCard from '../UserCard.vue'
import type { User } from '../../types'

const users: User[] = [
  {
    name: { first: 'Jane', last: 'Doe' },
    email: 'jane.doe@example.com',
    picture: { thumbnail: 'path/to/thumbnail.jpg' },
    favourite: true,
    login: { uuid: '1' },
    location: { city: 'New York', country: 'USA' },
    phone: '123-456-7890',
    tags: ['tagA'],
  },
  {
    name: { first: 'John', last: 'Smith' },
    email: 'john.smith@example.com',
    picture: { thumbnail: 'path/to/thumbnail2.jpg' },
    favourite: false,
    login: { uuid: '2' },
    location: { city: 'Los Angeles', country: 'USA' },
    phone: '987-654-3210',
    tags: ['tagB'],
  },
]

describe('UserList.vue', () => {
  it('renders a UserCard for each user in the list', () => {
    const wrapper = mount(UserList, {
      props: { userList: users },
    })

    const userCards = wrapper.findAllComponents(UserCard)
    expect(userCards).toHaveLength(users.length)
  })
})

it('emits userClick event when a UserCard is clicked', async () => {
  const wrapper = mount(UserList, {
    props: { userList: users },
  })

  const userCard = wrapper.findComponent(UserCard)
  await userCard.trigger('click')

  expect(wrapper.emitted().userClick).toBeTruthy()
  expect(wrapper.emitted().userClick[0]).toEqual([users[0]]) // Ensure the correct user is emitted
})

it('emits favouriteToggle event when favourite button is toggled', async () => {
  const wrapper = mount(UserList, {
    props: { userList: users },
  })

  const userCard = wrapper.findComponent(UserCard)
  await userCard.vm.$emit('favouriteToggle', users[0])

  expect(wrapper.emitted().favouriteToggle).toBeTruthy()
  expect(wrapper.emitted().favouriteToggle[0]).toEqual([users[0]]) // Ensure the correct user is emitted
})

it('emits updateTags event when tags are updated', async () => {
  const wrapper = mount(UserList, {
    props: { userList: users },
  })

  const userCard = wrapper.findComponent(UserCard)
  await userCard.vm.$emit('updateTags', users[0])

  expect(wrapper.emitted().updateTags).toBeTruthy()
  expect(wrapper.emitted().updateTags[0]).toEqual([users[0]]) // Ensure the correct user is emitted
})
