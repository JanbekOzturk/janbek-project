<template>
  <section class="hero">
    <div class="carousel" @mouseenter="$emit('pause')" @mouseleave="$emit('play')">
      <!-- left arrow (hidden while modal is open) -->
      <button class="nav prev" v-if="!selectedLesson" @click="$emit('prev')">‹</button>

      <!-- banner image (or lesson image if a lesson is open) -->
      <img
        :src="selectedLesson ? selectedLesson.img : banners[currentBanner]"
        :alt="selectedLesson ? selectedLesson.subject : 'banner image'"
        class="slide"
        draggable="false"
      />

      <!-- right arrow (hidden while modal is open) -->
      <button class="nav next" v-if="!selectedLesson" @click="$emit('next')">›</button>

      <!-- dots to jump to a banner (only when no modal) -->
      <div class="dots" v-if="!selectedLesson">
        <button
          v-for="(img, i) in banners"
          :key="i"
          class="dot"
          :class="{ active: i === currentBanner }"
          @click="$emit('go', i)"
        ></button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Hero',
  props: {
    banners: { type: Array, required: true },
    currentBanner: { type: Number, required: true },
    selectedLesson: { type: Object, default: null }
  }
}
</script>
