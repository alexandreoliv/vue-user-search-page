<script setup lang="ts">
import { defineProps } from 'vue'

interface User {
  picture: {
    thumbnail: string
  }
  name: {
    first: string
    last: string
  }
  email: string
}

defineProps<{
  userItem: User
}>()
</script>

<template>
  <div class="UserCard">
    <img :src="userItem.picture.thumbnail" alt="User Thumbnail" />
    <div class="userCardInfo">
      <p>{{ userItem.name.first }} {{ userItem.name.last }}</p>
      <p class="email">{{ userItem.email }}</p>
    </div>
  </div>
</template>

<style scoped>
.UserCard {
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  border-radius: 8px;
  background-color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;
}

.UserCard:hover {
  background-color: #f0f0f0;
}

.UserCard img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}
</style>
