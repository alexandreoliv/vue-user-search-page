<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface User {
  picture: {
    thumbnail: string
  }
  name: {
    first: string
    last: string
  }
  email: string
  favourite: boolean
}

defineProps<{
  userItem: User
}>()

const emit = defineEmits<{
  (event: 'click'): void
  (event: 'favouriteToggle', user: User): void
}>()

const onCardClick = () => {
  emit('click')
}

const toggleFavourite = (userItem: User) => {
  emit('favouriteToggle', userItem)
}
</script>

<template>
  <div class="UserCard" @click="onCardClick">
    <img :src="userItem.picture.thumbnail" alt="User Thumbnail" />
    <div class="userCardInfo">
      <p>{{ userItem.name.first }} {{ userItem.name.last }}</p>
      <p class="email">{{ userItem.email }}</p>
      <!-- @click.stop prevents the UserDetails component from opening when clicking the Favourite button -->
      <button @click.stop="toggleFavourite(userItem)" :class="{ favourite: userItem.favourite }">
        {{ userItem.favourite ? 'Unfavourite' : 'Favourite' }}
      </button>
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

button.favourite {
  background-color: gold;
}

button {
  padding: 5px 10px;
  margin-top: 5px;
  font-size: 12px;
  cursor: pointer;
}
</style>
