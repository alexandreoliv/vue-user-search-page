<script setup lang="ts">
import { ref } from 'vue'
import UserList from './components/UserList.vue'

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
}

const usersList = ref<User[]>([])
const loading = ref(false)

const sendUsers = async () => {
  loading.value = true
  const response = await fetch('https://randomuser.me/api/?results=5')
  const data = await response.json()
  usersList.value = [...usersList.value, ...data.results]
  loading.value = false
}
</script>

<template>
  <div class="MainContainer">
    <h2>User list</h2>
    <UserList :userList="usersList" :loading="loading" />
    <button @click="sendUsers" type="button">Show more</button>
  </div>
</template>

<style scoped>
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
