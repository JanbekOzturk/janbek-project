<template>
  <!-- Hero section: shows a rotating banner or lesson image -->
  <section class="hero">
    <!-- Main carousel area (pauses on hover) -->
    <div class="carousel" @mouseenter="$emit('pause')" @mouseleave="$emit('play')">

      <!-- Left navigation arrow (hidden if a lesson modal is open) -->
      <button
        class="nav prev"
        v-if="!selectedLesson"
        @click="$emit('prev')"
      >
        ‹
      </button>

      <!-- The main image:
           If a lesson is selected, show its image;
           otherwise, show the current banner. -->
      <img
        :src="selectedLesson ? selectedLesson.img : banners[currentBanner]"
        :alt="selectedLesson ? selectedLesson.subject : 'banner image'"
        class="slide"
        draggable="false"
      />

      <!-- Right navigation arrow (hidden if a lesson modal is open) -->
      <button
        class="nav next"
        v-if="!selectedLesson"
        @click="$emit('next')"
      >
        ›
      </button>

      <!-- Dots to manually pick a banner (only shown when no lesson is selected) -->
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
    // List of banner image paths
    banners: { type: Array, required: true },

    // The index of the currently active banner
    currentBanner: { type: Number, required: true },

    // If a lesson is selected, I temporarily show that lesson image instead of a banner
    selectedLesson: { type: Object, default: null }
  }
}
</script>

<style scoped>
.hero {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem auto;
}
.carousel {
  position: relative;
  width: 90%;
  max-width: 1000px;
  overflow: hidden;
  border-radius: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}
.slide {
  width: 100%;
  height: 420px;
  object-fit: cover;
  user-select: none;
  transition: opacity 0.4s ease;
}

/* Navigation arrows */
.nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.7);
  border: none;
  font-size: 2rem;
  line-height: 1;
  padding: 0.3rem 0.6rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
}
.nav:hover {
  background: rgba(255, 255, 255, 0.9);
}
.prev { left: 0.8rem; }
.next { right: 0.8rem; }

/* Dot navigation */
.dots {
  position: absolute;
  bottom: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background-color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: background-color 0.2s;
}
.dot.active {
  background-color: #c6d0c0;
}
</style>
