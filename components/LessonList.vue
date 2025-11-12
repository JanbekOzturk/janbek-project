<template>
  <!-- Simple list of lessons (each one is clickable) -->
  <ul>
    <li
      v-for="lesson in lessons"
      :key="lesson.id"
      @click="$emit('select', lesson)"
      :class="{ selected: selectedLesson && selectedLesson.id === lesson.id }"
    >
      <!-- Lesson image -->
      <img :src="lesson.img" :alt="lesson.subject" class="lesson-img" />

      <!-- Lesson name and location -->
      <h3 class="card-title">{{ lesson.subject }}</h3>
      <p class="card-sub">{{ lesson.location }}</p>

      <!-- Price and spaces info -->
      <div class="meta">
        <div class="price">£{{ lesson.price }}</div>
        <div class="spaces">Spaces left: {{ lesson.spaces }}</div>
      </div>

      <!-- Book button (disabled if full) -->
      <div class="actions">
        <button
          class="book-btn"
          @click.stop="$emit('book', lesson)"
          :disabled="lesson.spaces === 0"
        >
          {{ lesson.spaces === 0 ? 'Full' : 'Book' }}
        </button>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'LessonList',
  props: {
    // Array of lesson objects shown in the list
    lessons: { type: Array, required: true },

    // Keeps track of the currently selected lesson (if any)
    selectedLesson: { type: Object, default: null }
  }
}
</script>

<style scoped>
/* Each lesson card */
ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
li {
  background-color: #fff;
  border-radius: .8rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  padding: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}
li:hover { transform: scale(1.02); }
li.selected { outline: 3px solid #c6d0c0; }

.lesson-img { width: 100%; height: 160px; object-fit: cover; border-radius: .6rem; margin-bottom: .5rem; }

.card-title { font-size: 1.1rem; font-weight: 600; margin: 0.3rem 0; }
.card-sub { color: #666; margin-bottom: 0.5rem; }

.meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
.price { font-weight: 600; }
.spaces { font-size: 0.9rem; color: #555; }

.actions { text-align: right; }
.book-btn {
  background-color: #c6d0c0;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: .5rem;
  cursor: pointer;
}
.book-btn:disabled {
  background-color: #eee;
  cursor: not-allowed;
}
</style>
