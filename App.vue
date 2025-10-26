<template>
  <div>
    <!-- Page header -->
    <header class="topbar">
      <button class="brand" @click="goHome">After School Activities</button>

      <div class="topbar-actions">
        <button v-if="showCart" class="close-cart" @click="showCart = false">✕</button>

        <!-- Cart button (greyed out when empty) -->
        <button
          class="cart-toggle"
          :class="{ disabled: cartCount == 0 }"
          @click="openCart"
        >
          🛒 Cart <span v-if="cartCount > 0">({{ cartCount }})</span>
        </button>
      </div>
    </header>

    <!-- Banner / Hero -->
    <Hero
      :banners="banners"
      :currentBanner="currentBanner"
      :selectedLesson="selectedLesson"
      @prev="prev"
      @next="next"
      @go="go"
      @play="play"
      @pause="pause"
    />

    <!-- Lessons -->
    <section v-if="!showCart">
      <h1>Browse &amp; Book</h1>

      <!-- Toolbar: Search + Sort -->
      <div class="toolbar">
        <div class="search-bar">
          <label for="search">Search:</label>
          <input
            id="search"
            v-model.trim="searchText"
            type="text"
            placeholder="Subject or location"
          />
          <button v-if="searchText" class="ghost-btn small" @click="searchText = ''">Clear</button>
        </div>

        <div class="sort-bar toolbar-right">
          <label for="sort">Sort by:</label>
          <select id="sort" v-model="selectedSort" @change="sortLessons">
            <option value="default">Default</option>
            <option value="price">Price (Low → High)</option>
            <option value="availability">Availability (Most → Least)</option>
            <option value="location">Location (A → Z)</option>
          </select>
        </div>
      </div>

      <LessonList
        :lessons="filteredLessons"
        :selectedLesson="selectedLesson"
        @select="select"
        @book="book"
      />
    </section>

    <!-- Cart page -->
    <section v-else class="cart-wrap">
      <h1>My Cart</h1>

      <div v-if="cart.length === 0" class="empty">
        Cart is empty. Go add some activities!
      </div>

      <CartView
        v-else
        :cart="cart"
        :lessons="lessons"
        :grandTotal="grandTotal"
        @increase="increase"
        @decrease="decrease"
        @remove="removeItem"
        @checkout="checkout"
      />
    </section>

    <!-- Lesson modal -->
    <LessonModal
      v-if="selectedLesson"
      :lesson="selectedLesson"
      @close="clearSelection"
      @book="book"
    />
  </div>
</template>

<script>
import Hero from './components/Hero.vue'
import LessonList from './components/LessonList.vue'
import CartView from './components/Cart.vue'
import LessonModal from './components/LessonModal.vue'

export default {
  name: 'App',
  components: { Hero, LessonList, CartView, LessonModal },

  data: function () {
    return {
      banners: ['images/banner1.jpg','images/banner2.jpg','images/banner3.jpg'],
      currentBanner: 0,
      rotator: null,

      selectedLesson: null,
      showCart: false,

      cart: [],
      customer: { name: "", phone: "" },

      // NEW: search + sort
      searchText: "",
      selectedSort: 'default',

      lessons: [
        { id:1, subject:"Lego Robotics", location:"Hendon", price:90, spaces:5, img:"images/lego.jpg",
          desc:"Build and program LEGO robots with sensors. Races, maze challenges, and team missions each week." },
        { id:2, subject:"Creative Art Club", location:"Colindale", price:70, spaces:5, img:"images/art.jpg",
          desc:"Paint, collage, and clay! Learn color mixing, texture, and try mini-projects you can take home." },
        { id:3, subject:"Junior Coding", location:"Brent Cross", price:100, spaces:5, img:"images/coding.jpg",
          desc:"Start with Scratch and move to simple web pages. Make mini-games while learning logic step by step." },
        { id:4, subject:"Football Training", location:"Golders Green", price:60, spaces:5, img:"images/football.jpg",
          desc:"Dribbling, passing, shooting, and teamwork drills. Friendly mini-matches every session." },
        { id:5, subject:"Music Band Practice", location:"Hendon", price:80, spaces:5, img:"images/music.jpg",
          desc:"Try drums, keys, guitar, and singing. Learn rhythm and play easy songs together as a band." },
        { id:6, subject:"Dance & Movement", location:"Colindale", price:75, spaces:5, img:"images/dance.jpg",
          desc:"Hip-hop and jazz basics with fun warm-ups, simple choreography, and confidence on stage." },
        { id:7, subject:"Cooking for Kids", location:"Brent Cross", price:65, spaces:5, img:"images/cooking.jpg",
          desc:"Measure, mix, and bake simple recipes safely. Learn kitchen rules and make a snack each week." },
        { id:8, subject:"Drama & Acting", location:"Hendon", price:85, spaces:5, img:"images/drama.jpg",
          desc:"Improv games, voice projection, and short scenes. Build confidence and perform mini-skits." },
        { id:9, subject:"Science Experiments", location:"Colindale", price:95, spaces:5, img:"images/science.jpg",
          desc:"Safe, hands-on experiments: slime, rockets, circuits, and physics demos that explain how things work." },
        { id:10, subject:"Art of Comics", location:"Hendon", price:70, spaces:5, img:"images/comic.jpg",
          desc:"Create characters, storyboards, and panels. Learn inking and speech bubbles for your own mini-comic." },
        { id:11, subject:"Nature Explorers", location:"Brent Cross", price:55, spaces:5, img:"images/nature.jpg",
          desc:"Outdoor discovery: plant and bug ID, mini-terrariums, compass skills, and eco-friendly crafts." },
        { id:12, subject:"Board Games Club", location:"Colindale", price:50, spaces:5, img:"images/boardgame.jpg",
          desc:"Strategy and co-op games, friendly tournaments, and design a simple board game with friends." }
      ]
    };
  },

  computed: {
    cartCount: function () {
      var total = 0;
      for (var i = 0; i < this.cart.length; i++) total += this.cart[i].qty;
      return total;
    },
    grandTotal: function () {
      var total = 0;
      for (var i = 0; i < this.cart.length; i++) total += this.cart[i].price * this.cart[i].qty;
      return total;
    },

    // NEW: filter by subject OR location (case-insensitive)
    filteredLessons: function () {
      var term = this.searchText.trim().toLowerCase();
      if (term == "") return this.lessons;

      var out = [];
      for (var i = 0; i < this.lessons.length; i++) {
        var l = this.lessons[i];
        var s = l.subject.toLowerCase();
        var loc = l.location.toLowerCase();
        if (s.indexOf(term) != -1 || loc.indexOf(term) != -1) out.push(l);
      }
      return out;
    }
  },

  methods: {
    getLessonById: function (id) {
      for (var i = 0; i < this.lessons.length; i++) if (this.lessons[i].id === id) return this.lessons[i];
      return null;
    },

    // sort current list (mutates lessons array)
    sortLessons: function () {
      if (this.selectedSort == "price") {
        this.lessons.sort(function (a, b) { return a.price - b.price; });
      } else if (this.selectedSort == "availability") {
        this.lessons.sort(function (a, b) { return b.spaces - a.spaces; });
      } else if (this.selectedSort == "location") {
        this.lessons.sort(function (a, b) {
          var A = a.location.toLowerCase(), B = b.location.toLowerCase();
          if (A < B) return -1; if (A > B) return 1; return 0;
        });
      } else {
        this.lessons.sort(function (a, b) { return a.id - b.id; });
      }
    },

    openCart: function () {
      if (this.cartCount == 0) { alert("Your cart is empty. Add some lessons first!"); return; }
      this.showCart = true;
    },

    select: function (lesson) { this.selectedLesson = lesson; this.pause(); },
    clearSelection: function () { this.selectedLesson = null; this.play(); },

    next: function () { this.currentBanner = (this.currentBanner + 1) % this.banners.length; },
    prev: function () { this.currentBanner = (this.currentBanner - 1 + this.banners.length) % this.banners.length; },
    go:   function (i) { this.currentBanner = i; },

    play: function () {
      if (this.rotator == null) {
        var self = this;
        this.rotator = setInterval(function () { self.next(); }, 4000);
      }
    },
    pause: function () { if (this.rotator != null) { clearInterval(this.rotator); this.rotator = null; } },

    book: function (lesson) {
      if (lesson.spaces === 0) return;
      var existing = -1;
      for (var i = 0; i < this.cart.length; i++) if (this.cart[i].id === lesson.id) existing = i;
      if (existing != -1) this.cart[existing].qty = this.cart[existing].qty + 1;
      else this.cart.push({ id: lesson.id, subject: lesson.subject, price: lesson.price, qty: 1 });
      lesson.spaces = lesson.spaces - 1;
    },

    increase: function (item) {
      var lesson = this.getLessonById(item.id);
      if (lesson && lesson.spaces > 0) { item.qty = item.qty + 1; lesson.spaces = lesson.spaces - 1; }
    },
    decrease: function (item) {
      var lesson = this.getLessonById(item.id);
      if (!lesson) return;
      if (item.qty > 1) { item.qty = item.qty - 1; lesson.spaces = lesson.spaces + 1; }
      else this.removeItem(item);
    },
    removeItem: function (item) {
      var lesson = this.getLessonById(item.id);
      if (lesson) lesson.spaces = lesson.spaces + item.qty;
      var newCart = [];
      for (var i = 0; i < this.cart.length; i++) if (this.cart[i].id != item.id) newCart.push(this.cart[i]);
      this.cart = newCart;
    },

    checkout: function () {
      var nameValid = /^[A-Za-z\s]+$/.test(this.customer.name.trim());
      var phoneValid = /^\d+$/.test(this.customer.phone.trim());
      if (!nameValid || !phoneValid) { alert("Please enter a valid Name (letters) and Phone (numbers)."); return; }
      if (this.cart.length == 0) { alert("Your cart is empty."); return; }
      alert("Order submitted! Thank you.");
      this.cart = []; this.customer = { name: "", phone: "" }; this.showCart = false;
    },

    goHome: function () { this.showCart = false; this.clearSelection(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  },

  mounted: function () { this.play(); }
}
</script>
