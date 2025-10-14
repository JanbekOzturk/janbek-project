// creating a Vue app using the CDN version
const { createApp } = Vue;

createApp({
  data() {
    return {
      // carousel images for the banners
      banners: [
  'images/banner1.jpg',
  'images/banner2.jpg',
  'images/banner3.jpg'
    ],

      currentBanner: 0,
      rotator: null, // interval id

      // page title
      title: "After School Activities",

      // activities available for kids aged 8–14
      lessons: [
        { subject: "Lego Robotics",      location: "Hendon",       price: 90 },
        { subject: "Creative Art Club",   location: "Colindale",    price: 70 },
        { subject: "Junior Coding",       location: "Brent Cross",  price: 100 },
        { subject: "Football Training",   location: "Golders Green",price: 60 },
        { subject: "Music Band Practice", location: "Hendon",       price: 80 },
        { subject: "Dance & Movement",    location: "Colindale",    price: 75 },
        { subject: "Cooking for Kids",    location: "Brent Cross",  price: 65 },
        { subject: "Drama & Acting",      location: "Hendon",       price: 85 },
        { subject: "Science Experiments", location: "Colindale",    price: 95 },
        { subject: "Art of Comics",       location: "Hendon",       price: 70 },
        { subject: "Nature Explorers",    location: "Brent Cross",  price: 55 },
        { subject: "Board Games Club",    location: "Colindale",    price: 50 }
      ]
    };
  },
  methods: {
    // go to next/prev slide
    next() { this.currentBanner = (this.currentBanner + 1) % this.banners.length; },
    prev() { this.currentBanner = (this.currentBanner - 1 + this.banners.length) % this.banners.length; },
    go(i)  { this.currentBanner = i; },

    // autoplay helpers
    play() {
      // avoid multiple intervals
      if (this.rotator) return;
      this.rotator = setInterval(() => this.next(), 4000); // 4s per slide
    },
    pause() {
      clearInterval(this.rotator);
      this.rotator = null;
    }
  },
  mounted() {
    // start the auto-rotate when page loads
    this.play();
  },
  beforeUnmount() {
    // clean up interval (good habit)
    this.pause();
  }
}).mount("#app"); // mounting the Vue app to the #app div
