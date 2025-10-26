<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-card" role="dialog" aria-modal="true">
      <img :src="lesson.img" :alt="lesson.subject" class="modal-img" />
      <div class="modal-body">
        <h2>{{ lesson.subject }}</h2>
        <p class="muted">{{ lesson.location }}</p>
        <p class="price">£{{ lesson.price }}</p>
        <p class="desc">{{ lesson.desc }}</p>

        <div class="modal-actions">
            <button class="book-btn lg" @click="$emit('book', lesson)" :disabled="lesson.spaces === 0">
            {{ lesson.spaces === 0 ? 'Full' : 'Book' }}
            </button>
            <button class="ghost-btn" @click="$emit('close')">Close</button>
        </div>
        </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'LessonModal',
  props: {
    lesson: { type: Object, required: true }
  }
}
</script>
