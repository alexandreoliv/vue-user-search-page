<script setup lang="ts">
import { computed, defineProps, type PropType } from 'vue'
import { Bar } from 'vue-chartjs'
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
import type { User } from '../types'

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const props = defineProps({
  usersList: {
    type: Array as PropType<User[]>,
    required: true,
  },
})

const options = {
  scales: {
    y: {
      ticks: {
        stepSize: 1, // Forces the ticks to be integer values
        beginAtZero: true,
      },
    },
  },
  plugins: {
    legend: {
      display: false, // Disable the legend (labels for each dataset)
    },
  },
}

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
const ageRangeCount: Record<string, number> = {}

// Use the getAgeRange function to categorise users by age
usersList.value.forEach(user => {
  const age = user.dob.age as number
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
          <Bar :data="countryData" :options="options" />
        </div>
      
        <div class="chart">
          <h3>Users by Gender</h3>
          <Bar :data="genderData" :options="options" />
        </div>
      
        <div class="chart">
          <h3>Users by Age Range</h3>
          <Bar :data="ageRangeData" :options="options" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.statistics-container {
  text-align: center;
  padding: 20px;
}

.charts {
  display: flex;
  flex-direction: column; /* Stack the charts vertically */
  gap: 20px;
}

.chart {
  margin: 0 auto; /* Center the charts */
  width: 50%;
}

h2 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
  text-transform: uppercase;
  letter-spacing: 2px;
  padding-bottom: 10px;
}

h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #34495e;
  margin-top: 10px;
  text-transform: capitalize;
  letter-spacing: 1px;
  padding-bottom: 5px;
}
</style>
