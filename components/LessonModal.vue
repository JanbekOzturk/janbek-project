<template>
  <!-- Backdrop: I close the modal only when the user clicks the empty area -->
  <div class="modal-backdrop" @click.self="$emit('close')">
    <!-- Modal card (role helps screen readers) -->
    <div class="modal-card" role="dialog" aria-modal="true" :aria-label="lesson.subject">
      <!-- Lesson image -->
      <img :src="lesson.img" :alt="lesson.subject" class="modal-img" />

      <!-- Lesson content -->
      <div class="modal-body">
        <h2 class="title">{{ lesson.subject }}</h2>
        <p class="muted">Location: {{ lesson.location }}</p>

        <div class="meta">
          <span class="price">£{{ lesson.price }}</span>
          <span class="spaces">Spaces left: {{ lesson.spaces }}</span>
        </div>

        <p class="desc">{{ lesson.desc }}</p>

        <!-- Actions -->
        <div class="modal-actions">
          <!-- I use type='button' so it never submits any parent form -->
          <button
            type="button"
            class="book-btn lg"
            @click="$emit('book', lesson)"
            :disabled="lesson.spaces === 0"
          >
            {{ lesson.spaces === 0 ? 'Full' : 'Book this lesson' }}
          </button>

          <button type="button" class="ghost-btn" @click="$emit('close')">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LessonModal',
  props: {
    // I receive one lesson to show in the modal
    lesson: { type: Object, required: true }
  },
  // I emit 'close' when the user dismisses the modal and 'book' when they confirm
  emits: ['close', 'book']
}
</script>

<style scoped>
/* Backdrop covers the screen and centers the modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

/* Card */
.modal-card {
  width: min(720px, 92vw);
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0,0,0,.2);
  overflow: hidden;
}

/* Image */
.modal-img {
  width: 100%;
  height: 260px;
  object-fit: cover;
  display: block;
}

/* Body */
.modal-body { padding: 1rem; }
.title { margin: 0 0 .25rem; font-size: 1.35rem; font-weight: 700; }
.muted { color: #666; margin: 0 0 .5rem; }

.meta {
  display: flex;
  gap: .75rem;
  align-items: baseline;
  margin-bottom: .5rem;
}
.price { font-weight: 700; }
.spaces { color: #555; }

.desc { line-height: 1.5; color: #333; margin-bottom: 1rem; }

/* Buttons */
.modal-actions {
  display: flex;
  gap: .5rem;
  justify-content: flex-end;
}
.book-btn {
  background-color: #c6d0c0;
  border: none;
  padding: .55rem 1rem;
  border-radius: .6rem;
  cursor: pointer;
  font-weight: 600;
}
.book-btn:disabled { background-color: #eee; cursor: not-allowed; }
.ghost-btn {
  background: transparent;
  border: 1px solid #ddd;
  padding: .55rem 1rem;
  border-radius: .6rem;
  cursor: pointer;
}
</style>
