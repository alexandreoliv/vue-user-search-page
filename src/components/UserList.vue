<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import UserCard from './UserCard.vue'
import type { User } from '../types'

defineProps<{
  userList: User[]
}>()

const emit = defineEmits<{
  (event: 'userClick', user: User): void
  (event: 'favouriteToggle', user: User): void
  (event: 'updateTags', user: User): void
}>()

const handleUserClick = (user: User) => {
  emit('userClick', user)
}

const toggleFavourite = (user: User) => {
  emit('favouriteToggle', user)
}

const updateTags = (user: User) => {
  emit('updateTags', user)
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
      @updateTags="updateTags"
    />
  </div>
</template>

<style scoped>
.UserList {
  height: 75vh;
  overflow-y: auto;
  position: relative;
  border-top-left-radius: 5px;
  padding-left: 2%;
  padding-right: 2%;
}

@media (max-width: 800px) {
  .UserList {
    width: 100%;
  }
}
</style>
