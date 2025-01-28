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
      <div class="user-name">
        <p>
          <span>{{ userItem.name.first }} {{ userItem.name.last }}</span>
          <!-- @click.stop prevents the UserDetails component from opening when clicking the Favourite button -->
          <button
            @click.stop="toggleFavourite(userItem)"
            :class="{ favourite: userItem.favourite }"
            aria-label="Toggle favourite"
          >
            <span :class="userItem.favourite ? 'filled-star' : 'empty-star'">★</span>
          </button>
        </p>
      </div>
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

button {
  background: none;
  border: none;
  padding: 0;
  font-size: 24px;
  cursor: pointer;
  display: inline;
  color: inherit;
}

button span {
  display: inline-block;
}

.filled-star {
  color: gold;
}

.empty-star {
  color: #ccc;
}
</style>
