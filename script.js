// creating a Vue app using the CDN version
const { createApp } = Vue;

createApp({
  data() {
    return {
      // top-of-page carousel banners
      banners: [
        'images/banner1.jpg',
        'images/banner2.jpg',
        'images/banner3.jpg'
      ],
      currentBanner: 0,
      rotator: null, // autoplay interval id

      // selected lesson state (null when nothing selected)
      selectedLesson: null,

      // page title
      title: "After School Activities",

        // activities with thumbnail images + short descriptions
      lessons: [
            { subject: "Lego Robotics",      location: "Hendon",        price: 90,  img: "images/lego.jpg",
                desc: "Build and program LEGO robots with sensors. Races, maze challenges, and team missions each week." },
            { subject: "Creative Art Club",  location: "Colindale",     price: 70,  img: "images/art.jpg",
                desc: "Paint, collage, and clay! Learn color mixing, texture, and try mini-projects you can take home." },
            { subject: "Junior Coding",      location: "Brent Cross",   price: 100, img: "images/coding.jpg",
                desc: "Start with Scratch and move to simple web pages. Make mini-games while learning logic step by step." },
            { subject: "Football Training",  location: "Golders Green", price: 60,  img: "images/football.jpg",
                desc: "Dribbling, passing, shooting, and teamwork drills. Friendly mini-matches every session." },
            { subject: "Music Band Practice",location: "Hendon",        price: 80,  img: "images/music.jpg",
                desc: "Try drums, keys, guitar, and singing. Learn rhythm and play easy songs together as a band." },
            { subject: "Dance & Movement",   location: "Colindale",     price: 75,  img: "images/dance.jpg",
                desc: "Hip-hop and jazz basics with fun warm-ups, simple choreography, and confidence on stage." },
            { subject: "Cooking for Kids",   location: "Brent Cross",   price: 65,  img: "images/cooking.jpg",
                desc: "Measure, mix, and bake simple recipes safely. Learn kitchen rules and make a snack each week." },
            { subject: "Drama & Acting",     location: "Hendon",        price: 85,  img: "images/drama.jpg",
                desc: "Improv games, voice projection, and short scenes. Build confidence and perform mini-skits." },
            { subject: "Science Experiments",location: "Colindale",     price: 95,  img: "images/science.jpg",
                desc: "Safe, hands-on experiments: slime, rockets, circuits, and physics demos that explain how things work." },
            { subject: "Art of Comics",      location: "Hendon",        price: 70,  img: "images/comics.jpg",
                desc: "Create characters, storyboards, and panels. Learn inking and speech bubbles for your own mini-comic." },
            { subject: "Nature Explorers",   location: "Brent Cross",   price: 55,  img: "images/nature.jpg",
                desc: "Outdoor discovery: plant and bug ID, mini-terrariums, compass skills, and eco-friendly crafts." },
            { subject: "Board Games Club",   location: "Colindale",     price: 50,  img: "images/games.jpg",
                desc: "Strategy and co-op games, friendly tournaments, and design a simple board game with friends." }
      ]

    };
  },

  computed: {
    // hero shows selected lesson image if any, else current rotating banner
    currentHeroSrc() {
      return this.selectedLesson ? this.selectedLesson.img
                                 : this.banners[this.currentBanner];
    },
    // change key to force <img> to re-render when source changes
    currentHeroKey() {
      return this.selectedLesson
        ? `sel-${this.selectedLesson.subject}`
        : `ban-${this.currentBanner}`;
    }
  },

  methods: {
    // card selection handlers
    select(lesson) {
      this.selectedLesson = lesson; // pick a card
      this.pause();                 // pause rotation while focused
      // optional: scroll hero into view on mobile
      // document.querySelector('.hero')?.scrollIntoView({ behavior: 'smooth' });
    },
    clearSelection() {
      this.selectedLesson = null; // unselect
      this.play();                // resume rotation
    },

    // pretend booking (we’ll wire a cart later)
    book(lesson) {
      alert(`Booked: ${lesson.subject} in ${lesson.location} — £${lesson.price}`);
    },

    // carousel controls
    next() { this.currentBanner = (this.currentBanner + 1) % this.banners.length; },
    prev() { this.currentBanner = (this.currentBanner - 1 + this.banners.length) % this.banners.length; },
    go(i)  { this.currentBanner = i; },

    // autoplay
    play() { if (!this.selectedLesson && !this.rotator) this.rotator = setInterval(() => this.next(), 4000); },
    pause() { clearInterval(this.rotator); this.rotator = null; },

    // close on ESC for accessibility
    onKey(e) {
      if (e.key === 'Escape' && this.selectedLesson) this.clearSelection();
    }
  },

  mounted() {
    this.play();
    window.addEventListener('keydown', this.onKey);
  },
  beforeUnmount() {
    this.pause();
    window.removeEventListener('keydown', this.onKey);
  }
}).mount("#app"); // mounting the Vue app to the #app div
