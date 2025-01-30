import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import UserStatistics from '../UserStatistics.vue'
import { Bar } from 'vue-chartjs'
import { users } from './testUsers'

describe('UserStatistics.vue', () => {
  it('renders all charts when usersList is provided', () => {
    const wrapper = mount(UserStatistics, {
      props: { usersList: users },
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
    props: { usersList: users },
  })

  const countryData = wrapper.vm.countryData

  // Check that the data has the expected labels (countries)
  expect(countryData.labels).toEqual(['USA'])

  // Check that the dataset contains the correct count for the country
  expect(countryData.datasets[0].data).toEqual([2]) // 2 users from USA
})

it('categorizes users by gender', () => {
  const wrapper = mount(UserStatistics, {
    props: { usersList: users },
  })

  const genderData = wrapper.vm.genderData

  // Check that the data has the expected labels (gender)
  expect(genderData.labels).toEqual(['male', 'female'])

  // Check that the dataset contains the correct count for each gender
  expect(genderData.datasets[0].data).toEqual([1, 1]) // 1 male, 1 female
})

it('categorizes users by age range', () => {
  const wrapper = mount(UserStatistics, {
    props: { usersList: users },
  })

  const ageRangeData = wrapper.vm.ageRangeData

  // Check that the data has the expected labels (age ranges)
  expect(ageRangeData.labels).toEqual(['35-39', '30-34'])

  // Check that the dataset contains the correct count for each age range
  expect(ageRangeData.datasets[0].data).toEqual([1, 1]) // 1 user in each range
})
