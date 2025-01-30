import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import UserStatistics from '../UserStatistics.vue'
import { Bar } from 'vue-chartjs'
import { User } from '../../types'

const mockUsers: User[] = [
  {
    name: { first: 'Jane', last: 'Doe' },
    email: 'jane.doe@example.com',
    picture: { thumbnail: 'path/to/thumbnail.jpg' },
    favourite: true,
    login: { uuid: '1' },
    location: { city: 'New York', country: 'USA' },
    phone: '123-456-7890',
    tags: ['tagA'],
    gender: 'female',
    dob: { age: 28 },
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
    gender: 'male',
    dob: { age: 35 },
  },
  {
    name: { first: 'Alice', last: 'Johnson' },
    email: 'alice.johnson@example.com',
    picture: { thumbnail: 'path/to/thumbnail3.jpg' },
    favourite: true,
    login: { uuid: '3' },
    location: { city: 'San Francisco', country: 'USA' },
    phone: '555-555-5555',
    tags: ['tagC'],
    gender: 'female',
    dob: { age: 22 },
  },
]

describe('UserStatistics.vue', () => {
  it('renders all charts when usersList is provided', () => {
    const wrapper = mount(UserStatistics, {
      props: { usersList: mockUsers },
    })

    // Ensure that all three charts are rendered
    expect(wrapper.findAllComponents(Bar)).toHaveLength(3)

    // Check for the chart titles
    expect(wrapper.text()).toContain('Users by Country')
    expect(wrapper.text()).toContain('Users by Gender')
    expect(wrapper.text()).toContain('Users by Age Range')
  })
})

it('categorizes users by country', () => {
  const wrapper = mount(UserStatistics, {
    props: { usersList: mockUsers },
  })

  const countryData = wrapper.vm.countryData

  // Check that the data has the expected labels (countries)
  expect(countryData.labels).toEqual(['USA'])

  // Check that the dataset contains the correct count for the country
  expect(countryData.datasets[0].data).toEqual([3]) // 3 users from USA
})

it('categorizes users by gender', () => {
  const wrapper = mount(UserStatistics, {
    props: { usersList: mockUsers },
  })

  const genderData = wrapper.vm.genderData

  // Check that the data has the expected labels (gender)
  expect(genderData.labels).toEqual(['female', 'male'])

  // Check that the dataset contains the correct count for each gender
  expect(genderData.datasets[0].data).toEqual([2, 1]) // 2 females, 1 male
})

it('categorizes users by age range', () => {
  const wrapper = mount(UserStatistics, {
    props: { usersList: mockUsers },
  })

  const ageRangeData = wrapper.vm.ageRangeData

  // Check that the data has the expected labels (age ranges)
  expect(ageRangeData.labels).toEqual(['25-29', '35-39', '20-24'])

  // Check that the dataset contains the correct count for each age range
  expect(ageRangeData.datasets[0].data).toEqual([1, 1, 1]) // 1 user in each range
})
