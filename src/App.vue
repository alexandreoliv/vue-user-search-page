<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
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
  tags?: string[]
}

const usersList = ref<User[]>([])
const filteredUsers = ref<User[]>([])
const loading = ref(false)
const searchText = ref('')
const genderFilter = ref('')
const selectedUser = ref<User | null>(null)
const showFavouritesOnly = ref(false)

// Watch the state and save to sessionStorage
watch([searchText, genderFilter, showFavouritesOnly, selectedUser], () => {
  sessionStorage.setItem('searchText', searchText.value)
  sessionStorage.setItem('genderFilter', genderFilter.value)
  sessionStorage.setItem('showFavouritesOnly', JSON.stringify(showFavouritesOnly.value))
  sessionStorage.setItem('selectedUser', JSON.stringify(selectedUser.value))
  sessionStorage.setItem('usersList', JSON.stringify(usersList.value))
  sessionStorage.setItem('filteredUsers', JSON.stringify(filteredUsers.value))
}, { deep: true })

const sendUsers = async () => {
  loading.value = true
  const response = await fetch('https://randomuser.me/api/?results=5&inc=gender,name,picture,login,location,email,phone')
  const data = await response.json()

   // Ensure each user has the 'favourite' property
   const usersWithFavourite = data.results.map((user: any) => ({
    ...user,
    favourite: false
  }))

  usersList.value = [...usersList.value, ...usersWithFavourite]
  sessionStorage.setItem('usersList', JSON.stringify(usersList.value))
  filterUsers() // Reapply filters to include the newly added users
  loading.value = false
}

onMounted(() => {
  // Restore state from sessionStorage if available
  const savedSearchText = sessionStorage.getItem('searchText')
  if (savedSearchText) {
    searchText.value = savedSearchText
  }

  const savedGenderFilter = sessionStorage.getItem('genderFilter')
  if (savedGenderFilter) {
    genderFilter.value = savedGenderFilter
  }

  const savedShowFavouritesOnly = sessionStorage.getItem('showFavouritesOnly')
  if (savedShowFavouritesOnly) {
    showFavouritesOnly.value = JSON.parse(savedShowFavouritesOnly)
  }

  const savedSelectedUser = sessionStorage.getItem('selectedUser')
  if (savedSelectedUser) {
    selectedUser.value = JSON.parse(savedSelectedUser)
  }

  const savedUsersList = sessionStorage.getItem('usersList')
  if (savedUsersList) {
    usersList.value = JSON.parse(savedUsersList)
  }

  const savedFilteredUsers = sessionStorage.getItem('filteredUsers')
  if (savedFilteredUsers) {
    filteredUsers.value = JSON.parse(savedFilteredUsers)
  }

   // Only fetch new users if no users are saved in sessionStorage
   savedUsersList ? filterUsers() : sendUsers()
})

const toggleFavourite = (user: User) => {
  // Find the user in the usersList and toggle the favourite property
  const updatedUsers = usersList.value.map(u =>
    u.login.uuid === user.login.uuid ? { ...u, favourite: u.favourite } : u
  )
  usersList.value = updatedUsers
  sessionStorage.setItem('usersList', JSON.stringify(usersList.value))
  filterUsers() // Reapply filters
}

const updateTags = (user: User) => {
  const updatedUsers = usersList.value.map(u =>
    u.login.uuid === user.login.uuid ? user : u
  )
  usersList.value = updatedUsers
  sessionStorage.setItem('usersList', JSON.stringify(usersList.value))
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
    <section class="left-container">
      <h2>User list</h2>
      
      <div class="search-container">
        <input
          id="search-input"
          type="text"
          v-model="searchText"
          placeholder="Search by first or last name"
          @input="filterUsers"
        />
        <select id="gender-filter" v-model="genderFilter" @change="filterUsers">
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <label>
          <input type="checkbox" v-model="showFavouritesOnly" @change="filterUsers" />
          Show Only Favourites
        </label>
      </div>

      <div class="user-list">
        <UserList
          :userList="filteredUsers"
          :loading="loading"
          @userClick="showUserDetails"
          @favouriteToggle="toggleFavourite"
          @updateTags="updateTags"
        />
        <button @click="sendUsers" type="button" class="more-results-button">
          More results...
        </button>
      </div>
    </section>
    
    <article class="right-container">
      <UserDetails :selectedUser="selectedUser" />
    </article>
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
  justify-content: flex-start;
  align-items: flex-start;
  gap: 20px;  /* Space between the two containers */
}

.MainContainer button {
  padding: 10px 0px;
  width: 600px;
  background-color: #abb8c3;
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

.left-container {
  flex: 1;
  /* min-width: 300px; */
}

.right-container {
  flex: 0 0 400px; /* Fixed width for UserDetails */
  margin-left: 20px;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.more-results-button {
  align-self: center;
  padding: 10px 0;
  width: 600px;
  background-color: #abb8c3;
  border: none;
  color: white;
  font-size: 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.5s;
}

.more-results-button:hover {
  background-color: darkcyan;
}

@media (max-width: 800px) {
  .MainContainer {
    flex-direction: column; /* Stack containers vertically on small screens */
    align-items: center;
  }

  .MainContainer button {
    width: 100%;
  }

  .right-container {
    margin-left: 0; /* Remove margin on smaller screens */
  }
}
</style>
