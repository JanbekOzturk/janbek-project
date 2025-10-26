<template>
  <ul>
    <li
      v-for="lesson in lessons"
      :key="lesson.id"
      @click="$emit('select', lesson)"
      :class="{ selected: selectedLesson && selectedLesson.id === lesson.id }"
    >
      <img :src="lesson.img" :alt="lesson.subject" class="lesson-img" />

      <h3 class="card-title">{{ lesson.subject }}</h3>
      <p class="card-sub">{{ lesson.location }}</p>

      <div class="meta">
        <div class="price">£{{ lesson.price }}</div>
        <div class="spaces">Spaces left: {{ lesson.spaces }}</div>
      </div>

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
    lessons: { type: Array, required: true },
    selectedLesson: { type: Object, default: null }
  }
}
</script>
