<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import Loader from './Loader.vue'
import UserCard from './UserCard.vue'

interface User {
  login: {
    uuid: string
  }
  favourite: boolean
  [key: string]: any // To allow additional user properties
}

defineProps<{
  userList: User[]
  loading: boolean
}>()

const emit = defineEmits<{
  (event: 'userClick', user: User): void
  (event: 'favouriteToggle', user: User): void
}>()

const handleUserClick = (user: User) => {
  emit('userClick', user)
}

const toggleFavourite = (user: User) => {
  user.favourite = !user.favourite;
  emit('favouriteToggle', user)
}
</script>

<template>
  <div class="UserList">
    <UserCard
      v-for="user in userList"
      :key="user.login.uuid"
      :userItem="user"
      @click="handleUserClick(user)"
      @favouriteToggle="toggleFavourite"
    />
    <p class="msg" v-if="userList.length === 0 && !loading">The list is currently empty</p>
    <Loader v-if="loading" />
  </div>
</template>

<style scoped>
.UserList {
  width: 600px;
  height: 600px;
  overflow-y: auto;
  position: relative;
  background-color: #abb8c3;
  border-top-left-radius: 5px;
}

.msg {
  font-family: 'Lucida Sans', Geneva, Verdana, sans-serif;
  position: absolute;
  top: 40%;
  color: white;
  left: 37%;
}

@media (max-width: 800px) {
  .UserList {
    width: 100%;
  }

  .msg {
    left: 30%;
  }
}
</style>
