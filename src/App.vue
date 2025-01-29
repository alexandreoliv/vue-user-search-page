<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import UserList from './components/UserList.vue'
import UserDetails from './components/UserDetails.vue'
import UserStatistics from './components/UserStatistics.vue'

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
  dob: {
    date: string
    age: number
  }
}

const usersList = ref<User[]>([])
const filteredUsers = ref<User[]>([])
const loading = ref(false)
const searchText = ref('')
const genderFilter = ref('')
const selectedUser = ref<User | null>(null)
const showFavouritesOnly = ref<string>('')
const showStatistics = ref(false)

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
  const response = await fetch('https://randomuser.me/api/?results=5&inc=gender,name,picture,login,location,email,phone,dob')
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
  
  // Ensure the selected user also updates
  if (selectedUser.value && selectedUser.value.login.uuid === user.login.uuid) {
    selectedUser.value = { ...selectedUser.value, favourite: user.favourite }
    sessionStorage.setItem('selectedUser', JSON.stringify(selectedUser.value))
  }
  
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
    const matchesFavourites =
      showFavouritesOnly.value === '' ||
      (showFavouritesOnly.value === 'true' && user.favourite) ||
      (showFavouritesOnly.value === 'false' && !user.favourite)
    return matchesName && matchesGender && matchesFavourites
  })
}

const showUserDetails = (user: User) => {
  showStatistics.value = false
  selectedUser.value = user
}

const closeUserDetails = () => {
  selectedUser.value = null
}

const toggleStatistics = () => {
  // When statistics are toggled, close the user details if open
  if (selectedUser.value) {
    selectedUser.value = null
  }
  showStatistics.value = !showStatistics.value
}
</script>

<template>
  <div class="MainContainer">
    <section class="left-container">
      <div class="search-container">
        <input
          id="search-input"
          type="text"
          v-model="searchText"
          placeholder="Search by name"
          @input="filterUsers"
        />
        <select id="gender-filter" v-model="genderFilter" @change="filterUsers">
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <select id="favourite-filter" v-model="showFavouritesOnly" @change="filterUsers">
          <option value="">All Users</option>
          <option value="true">Only Favourites</option>
          <option value="false">No Favourites</option>
        </select>
      </div>

      <div class="statistics-toggle-container">
        <button 
          @click="toggleStatistics" 
          type="button" 
          class="toggle-statistics-button" 
          :disabled="usersList.length === 0">
          {{ showStatistics ? 'Hide Statistics' : 'Show Statistics' }}
        </button>
      </div>

      <div class="user-list">
        <UserList
          :userList="filteredUsers"
          @userClick="showUserDetails"
          @favouriteToggle="toggleFavourite"
          @updateTags="updateTags"
        />
        <button @click="sendUsers" type="button" class="more-results-button" :disabled="loading">
          {{ loading ? 'Loading...' : 'More results...' }}
        </button>
      </div>
    </section>
    
    <article class="right-container">
      <UserDetails :selectedUser="selectedUser" @close="closeUserDetails" />
      <UserStatistics v-if="showStatistics && filteredUsers.length > 0" :usersList="filteredUsers" />
    </article>
  </div>
</template>

<style scoped>
.search-container {
  display: flex;
  gap: 10px;
  margin-top: 5px;
  margin-bottom: 15px;
}

.search-container input,
.search-container select {
  padding: 10px;
  font-size: 15px;
  border-radius: 5px;
}

.MainContainer {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 95vw;
}

.left-container {
  flex: 1;
  background-color: white;
  padding: 0;
  margin: 0;
}

.right-container {
  flex: 1;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 15px; /* Distance to the "More results..." button */
}

.more-results-button {
  align-self: center;
  padding: 10px 0;
  width: 90%;
  background-color: #abb8c3;
  border: none;
  color: white;
  font-size: 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}

.more-results-button:hover {
  background-color: #767f86;
}

.more-results-button:disabled {
  background-color: #d1d1d1;
  cursor: not-allowed;
}

.statistics-toggle-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 20px;
}

.toggle-statistics-button {
  padding: 10px 0;
  width: 90%;
  background-color: #abb8c3;
  border: none;
  color: white;
  font-size: 18px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}

.toggle-statistics-button:hover {
  background-color: #767f86;
}

.toggle-statistics-button:disabled {
  background-color: #d1d1d1;
  cursor: not-allowed;
}

@media (min-width: 900px) {
  .MainContainer {
    gap: 30px;  /* Space between the two containers */
  }

  .left-container {
    width: 40%;
    height: 100%;
  }
}

@media (max-width: 899px) {
  .MainContainer {
    flex-direction: column; /* Stack the containers vertically */
    align-items: center;
    margin: 2%;
    gap: 20px;  /* Space between the two containers */
  }

  .right-container {
    order: -1; /* Move the right-container to the top */
    width: 90%;
  }

  .left-container {
    order: 1; /* Make sure the left-container appears below the right-container */
  }
}

@media (max-width: 1199px) {
  .search-container {
    flex-direction: column;
    align-items: center;
  }

  .search-container > * { /* Targets direct children */
    width: 90%;
  }
}

@media (min-width: 1200px) {
  .search-container {
    justify-content: center;
  }
}
</style>
