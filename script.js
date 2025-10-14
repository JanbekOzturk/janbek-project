// creating a Vue app using the CDN version
const { createApp } = Vue;

createApp({
  data() {
    return {
      // hero banners
      banners: ['images/banner1.jpg','images/banner2.jpg','images/banner3.jpg'],
      currentBanner: 0,
      rotator: null,

      // selection + view state
      selectedLesson: null,
      showCart: false,

      // basic cart + user
      cart: [],                 // [{id, subject, price, qty}]
      customer: { name: "", phone: "" },

      // activities (added id + spaces)
      lessons: [
        { id:1, subject:"Lego Robotics",       location:"Hendon",        price:90,  spaces:5, img:"images/lego.jpg",
          desc:"Build and program LEGO robots with sensors. Races, maze challenges, and team missions each week." },
        { id:2, subject:"Creative Art Club",   location:"Colindale",     price:70,  spaces:5, img:"images/art.jpg",
          desc:"Paint, collage, and clay! Learn color mixing, texture, and try mini-projects you can take home." },
        { id:3, subject:"Junior Coding",       location:"Brent Cross",   price:100, spaces:5, img:"images/coding.jpg",
          desc:"Start with Scratch and move to simple web pages. Make mini-games while learning logic step by step." },
        { id:4, subject:"Football Training",   location:"Golders Green", price:60,  spaces:5, img:"images/football.jpg",
          desc:"Dribbling, passing, shooting, and teamwork drills. Friendly mini-matches every session." },
        { id:5, subject:"Music Band Practice", location:"Hendon",        price:80,  spaces:5, img:"images/music.jpg",
          desc:"Try drums, keys, guitar, and singing. Learn rhythm and play easy songs together as a band." },
        { id:6, subject:"Dance & Movement",    location:"Colindale",     price:75,  spaces:5, img:"images/dance.jpg",
          desc:"Hip-hop and jazz basics with fun warm-ups, simple choreography, and confidence on stage." },
        { id:7, subject:"Cooking for Kids",    location:"Brent Cross",   price:65,  spaces:5, img:"images/cooking.jpg",
          desc:"Measure, mix, and bake simple recipes safely. Learn kitchen rules and make a snack each week." },
        { id:8, subject:"Drama & Acting",      location:"Hendon",        price:85,  spaces:5, img:"images/drama.jpg",
          desc:"Improv games, voice projection, and short scenes. Build confidence and perform mini-skits." },
        { id:9, subject:"Science Experiments", location:"Colindale",     price:95,  spaces:5, img:"images/science.jpg",
          desc:"Safe, hands-on experiments: slime, rockets, circuits, and physics demos that explain how things work." },
        { id:10, subject:"Art of Comics",      location:"Hendon",        price:70,  spaces:5, img:"images/comic.jpg",
          desc:"Create characters, storyboards, and panels. Learn inking and speech bubbles for your own mini-comic." },
        { id:11, subject:"Nature Explorers",   location:"Brent Cross",   price:55,  spaces:5, img:"images/nature.jpg",
          desc:"Outdoor discovery: plant and bug ID, mini-terrariums, compass skills, and eco-friendly crafts." },
        { id:12, subject:"Board Games Club",   location:"Colindale",     price:50,  spaces:5, img:"images/boardgame.jpg",
          desc:"Strategy and co-op games, friendly tournaments, and design a simple board game with friends." }
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
