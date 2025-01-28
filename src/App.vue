<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UserList from './components/UserList.vue'
import UserDetails from './components/UserDetails.vue'

interface User {
  name: {
    first: string
    last: string
  }
  gender: string
  picture: {
    large: string
  }
  login: {
    uuid: string
  }
  location: {
    city: string
    state: string
    country: string
  }
  email: string
  phone: string
  favourite: boolean
}

const usersList = ref<User[]>([])
const filteredUsers = ref<User[]>([])
const loading = ref(false)
const searchText = ref('')
const genderFilter = ref('')
const selectedUser = ref<User | null>(null)
const showFavouritesOnly = ref(false)

const sendUsers = async () => {
  loading.value = true
  const response = await fetch('https://randomuser.me/api/?results=5')
  const data = await response.json()

   // Ensure each user has the 'favourite' property
   const usersWithFavourite = data.results.map((user: any) => ({
    ...user,
    favourite: false, // Add the 'favourite' property here
  }))

  usersList.value = [...usersList.value, ...usersWithFavourite]
  filterUsers() // Reapply filters to include the newly added users
  loading.value = false
}

// Load the first 5 users when the component is mounted
onMounted(() => {
  sendUsers()
})

const toggleFavourite = (user: User) => {
  // Find the user in the usersList and toggle the favourite property
  const updatedUsers = usersList.value.map(u =>
    u.login.uuid === user.login.uuid ? { ...u, favourite: u.favourite } : u
  )
  usersList.value = updatedUsers
  filterUsers() // Reapply filters
}

const filterUsers = () => {
  const text = searchText.value.toLowerCase()
  filteredUsers.value = usersList.value.filter((user) => {
    const fullName = `${user.name.first} ${user.name.last}`.toLowerCase()
    const matchesName = fullName.includes(text)
    const matchesGender = genderFilter.value === '' || user.gender === genderFilter.value
    const matchesFavourites = !showFavouritesOnly.value || user.favourite
    return matchesName && matchesGender && matchesFavourites
  })
}

const showUserDetails = (user: User) => {
  selectedUser.value = user
}
</script>

<template>
  <div class="MainContainer">
    <h2>User list</h2>
    <div class="search-container">
      <input
        type="text"
        v-model="searchText"
        placeholder="Search by first or last name"
        @input="filterUsers"
      />
      <select v-model="genderFilter" @change="filterUsers">
        <option value="">All Genders</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <label>
        <input type="checkbox" v-model="showFavouritesOnly" @change="filterUsers" />
        Show Only Favourites
      </label>
    </div>
    <UserList
      :userList="filteredUsers"
      :loading="loading"
      @userClick="showUserDetails"
      @favouriteToggle="toggleFavourite"
    />
    <button @click="sendUsers" type="button">Show more</button>

    <UserDetails :selectedUser="selectedUser" />
  </div>
</template>

<style scoped>
.search-container {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.search-container input,
.search-container select {
  padding: 10px;
  font-size: 16px;
}

.MainContainer {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.MainContainer button {
  padding: 10px 0px;
  width: 600px;
  background-color: teal;
  border: none;
  color: white;
  font-size: 20px;
  border-radius: 0px 0px 5px 5px;
  cursor: pointer;
  transition: 0.5s;
}

.MainContainer h2 {
  color: white;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

@media (max-width: 800px) {
  .MainContainer button {
    width: 100%;
  }
}
</style>
