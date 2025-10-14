// using Vue from the CDN (prod build is loaded in index.html)
const { createApp } = Vue;

createApp({
  data() {
    return {
      // hero/banner
      banners: ['images/banner1.jpg','images/banner2.jpg','images/banner3.jpg'],
      currentBanner: 0,
      rotator: null,

      // UI state
      selectedLesson: null,   // the card opened in the modal (or null)
      showCart: false,        // toggle between grid and cart

      // cart + customer
      cart: [],               // [{ id, subject, price, qty }]
      customer: { name: "", phone: "" },

      // activities (id + spaces added for cart logic)
      lessons: [
        { id:1,  subject:"Lego Robotics",       location:"Hendon",        price:90,  spaces:5, img:"images/lego.jpg",
          desc:"Build and program LEGO robots with sensors. Races, maze challenges, and team missions each week." },
        { id:2,  subject:"Creative Art Club",   location:"Colindale",     price:70,  spaces:5, img:"images/art.jpg",
          desc:"Paint, collage, and clay! Learn color mixing, texture, and try mini-projects you can take home." },
        { id:3,  subject:"Junior Coding",       location:"Brent Cross",   price:100, spaces:5, img:"images/coding.jpg",
          desc:"Start with Scratch and move to simple web pages. Make mini-games while learning logic step by step." },
        { id:4,  subject:"Football Training",   location:"Golders Green", price:60,  spaces:5, img:"images/football.jpg",
          desc:"Dribbling, passing, shooting, and teamwork drills. Friendly mini-matches every session." },
        { id:5,  subject:"Music Band Practice", location:"Hendon",        price:80,  spaces:5, img:"images/music.jpg",
          desc:"Try drums, keys, guitar, and singing. Learn rhythm and play easy songs together as a band." },
        { id:6,  subject:"Dance & Movement",    location:"Colindale",     price:75,  spaces:5, img:"images/dance.jpg",
          desc:"Hip-hop and jazz basics with fun warm-ups, simple choreography, and confidence on stage." },
        { id:7,  subject:"Cooking for Kids",    location:"Brent Cross",   price:65,  spaces:5, img:"images/cooking.jpg",
          desc:"Measure, mix, and bake simple recipes safely. Learn kitchen rules and make a snack each week." },
        { id:8,  subject:"Drama & Acting",      location:"Hendon",        price:85,  spaces:5, img:"images/drama.jpg",
          desc:"Improv games, voice projection, and short scenes. Build confidence and perform mini-skits." },
        { id:9,  subject:"Science Experiments", location:"Colindale",     price:95,  spaces:5, img:"images/science.jpg",
          desc:"Safe, hands-on experiments: slime, rockets, circuits, and physics demos that explain how things work." },
        { id:10, subject:"Art of Comics",       location:"Hendon",        price:70,  spaces:5, img:"images/comic.jpg",
          desc:"Create characters, storyboards, and panels. Learn inking and speech bubbles for your own mini-comic." },
        { id:11, subject:"Nature Explorers",    location:"Brent Cross",   price:55,  spaces:5, img:"images/nature.jpg",
          desc:"Outdoor discovery: plant and bug ID, mini-terrariums, compass skills, and eco-friendly crafts." },
        { id:12, subject:"Board Games Club",    location:"Colindale",     price:50,  spaces:5, img:"images/boardgame.jpg",
          desc:"Strategy and co-op games, friendly tournaments, and design a simple board game with friends." }
      ]
    };
  },

  /* ---------- derived values ---------- */
  computed: {
    // hero shows selected lesson image if any, else rotating banner
    currentHeroSrc() {
      return this.selectedLesson ? this.selectedLesson.img
                                 : this.banners[this.currentBanner];
    },
    // change key to force <img> to re-render when source changes
    currentHeroKey() {
      return this.selectedLesson
        ? `sel-${this.selectedLesson.id}`
        : `ban-${this.currentBanner}`;
    },
    // total items in cart
    cartCount() {
      return this.cart.reduce((sum, it) => sum + it.qty, 0);
    },
    // money total
    grandTotal() {
      return this.cart.reduce((sum, it) => sum + it.price * it.qty, 0);
    }
  },

  /* ---------- helpers ---------- */
  methods: {
    getLessonById(id) {
      return this.lessons.find(l => l.id === id) || null;
    },

    /* ----- selection / modal ----- */
    select(lesson) {
      this.selectedLesson = lesson;
      this.pause();
    },
    clearSelection() {
      this.selectedLesson = null;
      this.play();
    },

    /* ----- carousel controls ----- */
    next() { this.currentBanner = (this.currentBanner + 1) % this.banners.length; },
    prev() { this.currentBanner = (this.currentBanner - 1 + this.banners.length) % this.banners.length; },
    go(i)  { this.currentBanner = i; },
    play() { if (!this.selectedLesson && !this.rotator) this.rotator = setInterval(() => this.next(), 4000); },
    pause(){ clearInterval(this.rotator); this.rotator = null; },

    /* ----- cart actions ----- */
    book(lesson) {
      // guard: no spaces left
      if (lesson.spaces === 0) return;

      // add or increase cart item
      const found = this.cart.find(it => it.id === lesson.id);
      if (found) {
        found.qty += 1;
      } else {
        this.cart.push({ id: lesson.id, subject: lesson.subject, price: lesson.price, qty: 1 });
      }

      // reduce available spaces
      lesson.spaces -= 1;

      // optional: show cart after first add
      // this.showCart = true;
    },

    increase(item) {
      const lesson = this.getLessonById(item.id);
      if (lesson && lesson.spaces > 0) {
        item.qty += 1;
        lesson.spaces -= 1;
      }
    },

    decrease(item) {
      const lesson = this.getLessonById(item.id);
      if (!lesson) return;

      if (item.qty > 1) {
        item.qty -= 1;
        lesson.spaces += 1;
      } else {
        // if qty would drop to 0, remove fully
        this.remove(item);
      }
    },

    remove(item) {
      // return all reserved spaces to the lesson
      const lesson = this.getLessonById(item.id);
      if (lesson) lesson.spaces += item.qty;

      this.cart = this.cart.filter(it => it.id !== item.id);
    },

    /* ----- checkout (front-end only for now) ----- */
    checkout() {
      // simple validation (letters only for name, digits only for phone)
      const nameOk  = /^[A-Za-z\s]+$/.test(this.customer.name.trim());
      const phoneOk = /^\d+$/.test(this.customer.phone.trim());

      if (!nameOk || !phoneOk) {
        alert("Please enter a valid Name (letters only) and Phone (numbers only).");
        return;
      }

      if (this.cart.length === 0) {
        alert("Your cart is empty.");
        return;
      }

      // front-end confirmation (back-end POST will come later)
      alert("Order submitted! Thank you.");
      // clear cart; spaces remain deducted by design
      this.cart = [];
      this.customer = { name: "", phone: "" };
      this.showCart = false;
    },

    goHome() {
        // go back to lessons, close any modal, and scroll to top
        this.showCart = false;
        this.clearSelection();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },


    // close modal on Esc
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
}).mount("#app");
