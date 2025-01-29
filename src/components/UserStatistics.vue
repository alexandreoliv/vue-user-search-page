<script setup lang="ts">
import { computed, defineProps, PropType } from 'vue'
import { Bar, Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from 'chart.js'

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const props = defineProps({
  usersList: {
    type: Array as PropType<Array<any>>,
    required: true,
  },
})

// Utility function to determine the age range
const getAgeRange = (age: number): string => {
  const ranges = [
    { min: 0, max: 5, label: '0-5' },
    { min: 5, max: 10, label: '5-10' },
    { min: 10, max: 15, label: '10-15' },
    { min: 15, max: 20, label: '15-20' },
    { min: 20, max: 25, label: '20-25' },
    { min: 25, max: 30, label: '25-30' },
    { min: 30, max: 35, label: '30-35' },
    { min: 35, max: 40, label: '35-40' },
    { min: 40, max: 45, label: '40-45' },
    { min: 45, max: 50, label: '45-50' },
    { min: 50, max: 55, label: '50-55' },
    { min: 55, max: 60, label: '55-60' },
    { min: 60, max: Infinity, label: '60+' },
  ]
  return ranges.find((range) => age >= range.min && age < range.max)!.label
}

// Ensure usersList is not undefined or empty
const usersList = computed(() => props.usersList || [])

// Computed data: Users by Country
const countryData = computed(() => {
  const countryCount = usersList.value.reduce(
    (acc, user) => {
      const country = user.location?.country || 'Unknown'
      acc[country] = (acc[country] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return {
    labels: Object.keys(countryCount),
    datasets: [
      {
        label: 'Users by Country',
        data: Object.values(countryCount),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  }
})

// Computed data: Users by Gender
const genderData = computed(() => {
  const genderCount = usersList.value.reduce(
    (acc, user) => {
      const gender = user.gender || 'Unknown'
      acc[gender] = (acc[gender] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return {
    labels: Object.keys(genderCount),
    datasets: [
      {
        label: 'Users by Gender',
        data: Object.values(genderCount),
        backgroundColor: ['#FF6384', '#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  }
})

// Computed data: Users by Age Range
const ageRangeData = computed(() => {
  if (usersList.value.length === 0) {
    return {
      labels: [],
      datasets: [{
        label: 'Users by Age Range',
        data: [],
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      }],
    }
  }

// Initialize a map to hold the count of each age range
const ageRangeCount = {}

// Use the getAgeRange function to categorise users by age
usersList.value.forEach(user => {
  const age = user.dob?.age
  if (age !== undefined) {
    const range = getAgeRange(age) // Get the age range for each user
    ageRangeCount[range] = (ageRangeCount[range] || 0) + 1
  }
})

// Now build the chart data
return {
  labels: Object.keys(ageRangeCount), // Labels from the age ranges
  datasets: [{
    label: 'Users by Age Range',
    data: Object.values(ageRangeCount), // Values from the age counts
    backgroundColor: 'rgba(153, 102, 255, 0.2)',
    borderColor: 'rgba(153, 102, 255, 1)',
    borderWidth: 1,
  }],
}
})
</script>

<template>
    <div v-if="usersList && usersList.length > 0">
  <div class="statistics-container" v-if="usersList.length > 0">
    <h2>User Statistics</h2>
    <div class="charts">
      <div class="chart">
        <h3>Users by Country</h3>
        <Bar :data="countryData" />
      </div>
      <div class="chart">
        <h3>Users by Gender</h3>
        <Pie :data="genderData" />
      </div>
      <div class="chart">
        <h3>Users by Age Range</h3>
        <Bar :data="ageRangeData" />
      </div>
    </div>
  </div>
    </div>
  <div v-else class="loading">
    <p>Loading user statistics...</p>
  </div>
</template>

<style scoped>
.statistics-container {
  text-align: center;
  padding: 20px;
}

.charts {
  display: flex;
  justify-content: space-around;
  gap: 20px;
}

.chart {
  width: 30%;
}

h3 {
  margin-bottom: 10px;
}
</style>
