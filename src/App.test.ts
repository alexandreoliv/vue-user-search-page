import { mount, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import App from './App.vue'
import UserList from './components/UserList.vue'
import { users } from './components/__tests__/testUsers'

// Define the component instance type
type AppComponentInstance = InstanceType<typeof App> & {
  searchText: string
  genderFilter: string
  showFavouritesOnly: boolean
  usersList: typeof users
  fetchUsers: () => Promise<void>
  toggleFavourite: (user: typeof users[0]) => Promise<void>
  filteredUsers: typeof users
}

describe('App.vue', () => {
  let wrapper: VueWrapper<AppComponentInstance>

  beforeEach(() => {
    sessionStorage.clear()
    wrapper = mount(App) as VueWrapper<AppComponentInstance>
  })

  it('renders the app correctly', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.findComponent(UserList).exists()).toBe(true)
  })

  it('fetches users on mount', async () => {
    global.fetch = vi.fn(
      () =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              results: users,
            }),
        } as unknown as Response), // Cast to 'unknown' first, then 'Response'
    )

    await wrapper.vm.fetchUsers()
    expect(wrapper.vm.usersList.length).toBeGreaterThan(0)
  })

  it('toggles favourites correctly', async () => {
    wrapper.vm.usersList = [users[0]]
    await wrapper.vm.toggleFavourite(users[0])
    expect(wrapper.vm.usersList[0].favourite).toBe(true)
  })

  it('restores sessionStorage data', () => {
    sessionStorage.setItem('searchText', 'john')
    sessionStorage.setItem('genderFilter', 'male')
    sessionStorage.setItem('showFavouritesOnly', 'true')
    sessionStorage.setItem('usersList', JSON.stringify([users[0]]))

    const newWrapper = mount(App) as VueWrapper<AppComponentInstance>
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
        results: users,
      }),
    } as unknown as Response
    global.fetch = vi.fn().mockResolvedValue(mockResponse)

    await wrapper.vm.fetchUsers()
    await nextTick()

    // Assert that usersList is updated
    expect(wrapper.vm.usersList.length).toBe(2)
    expect(wrapper.vm.filteredUsers.length).toBe(2)
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })
})
