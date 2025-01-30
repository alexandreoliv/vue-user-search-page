import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import App from './App.vue'
import UserList from './components/UserList.vue'

describe('App.vue', () => {
  let wrapper

  beforeEach(() => {
    sessionStorage.clear()
    wrapper = mount(App)
  })

  it('renders the app correctly', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.findComponent(UserList).exists()).toBe(true)
  })

  it('fetches users on mount', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            results: [
              {
                login: { uuid: '1' },
                name: { first: 'John', last: 'Doe' },
                gender: 'male',
                picture: { thumbnail: 'path/to/thumbnail.jpg' },
                favourite: false,
              },
            ],
          }),
      }),
    )

    await wrapper.vm.fetchUsers()
    expect(wrapper.vm.usersList.length).toBeGreaterThan(0)
  })

  it('toggles favourites correctly', async () => {
    const user = {
      login: { uuid: '1' },
      name: { first: 'John', last: 'Doe' },
      gender: 'male',
      picture: { thumbnail: 'path/to/thumbnail.jpg' },
      favourite: false,
    }

    wrapper.vm.usersList = [user]
    await wrapper.vm.toggleFavourite(user)
    expect(wrapper.vm.usersList[0].favourite).toBe(true)
  })

  it('restores sessionStorage data', () => {
    sessionStorage.setItem('searchText', 'john')
    sessionStorage.setItem('genderFilter', 'male')
    sessionStorage.setItem('showFavouritesOnly', 'true')
    sessionStorage.setItem(
      'usersList',
      JSON.stringify([{ login: { uuid: '1' }, name: { first: 'John', last: 'Doe' } }]),
    )

    const newWrapper = mount(App)
    expect(newWrapper.vm.searchText).toBe('john')
    expect(newWrapper.vm.genderFilter).toBe('male')
    expect(newWrapper.vm.showFavouritesOnly).toBe(true)
    expect(newWrapper.vm.usersList.length).toBe(1)
  })

  it('should fetch users and update the usersList and filteredUsers', async () => {
    wrapper.vm.usersList = []
    // Mock the fetch function
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({
        results: [
          {
            name: { first: 'John', last: 'Doe' },
            gender: 'male',
            picture: { thumbnail: 'path/to/thumbnail.jpg' },
            login: { uuid: '1' },
            favourite: false,
          },
          {
            name: { first: 'Jane', last: 'Doe' },
            gender: 'female',
            picture: { thumbnail: 'path/to/thumbnail.jpg' },
            login: { uuid: '2' },
            favourite: false,
          },
        ],
      }),
    }
    global.fetch = vi.fn().mockResolvedValue(mockResponse)

    await wrapper.vm.fetchUsers()
    await nextTick()

    // Assert that usersList is updated
    expect(wrapper.vm.usersList.length).toBe(2)
    expect(wrapper.vm.filteredUsers.length).toBe(2)
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })
})
