<template>
  <div>
    <!-- Header: brand takes me home (lessons), cart button opens cart -->
    <header class="topbar">
      <button class="brand" @click="goHome">After School Activities</button>

      <div class="topbar-actions">
        <button v-if="showCart" class="close-cart" @click="showCart = false">✕</button>

        <!-- Cart button (disabled if empty) -->
        <button
          class="cart-toggle"
          :class="{ disabled: cartCount == 0 }"
          @click="openCart"
        >
          🛒 Cart <span v-if="cartCount > 0">({{ cartCount }})</span>
        </button>
      </div>
    </header>

    <!-- Hero banner (simple image rotator) -->
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

    <!-- Lessons page (default view) -->
    <section v-if="!showCart">
      <h1>Browse &amp; Book</h1>

      <!-- Toolbar: I keep search/sort in localStorage so they stick on reload -->
      <div class="toolbar">
        <div class="search-bar">
          <label for="search">Search:</label>
          <input
            id="search"
            v-model.trim="searchText"
            @input="savePrefs"
            type="text"
            placeholder="Subject or location"
          />
          <button v-if="searchText" class="ghost-btn small" @click="clearSearch">Clear</button>
        </div>

        <div class="sort-bar toolbar-right">
          <label for="sort">Sort by:</label>
          <select id="sort" v-model="selectedSort" @change="onSortChange">
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

      <!-- Checkout collects email + phone; validation stays in App -->
      <CartView
        v-else
        :cart="cart"
        :lessons="lessons"
        :grandTotal="grandTotal"
        :email="customerEmail"
        :phone="customer.phone"
        :canCheckout="cart.length > 0"
        @update:email="v => (customerEmail = v)"
        @update:phone="v => (customer.phone = v)"
        @increase="increase"
        @decrease="decrease"
        @remove="removeItem"
        @checkout="checkout"
      />
    </section>

    <!-- Lesson details modal -->
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
      // Banner rotator state
      banners: ['images/banner1.jpg','images/banner2.jpg','images/banner3.jpg'],
      currentBanner: 0,
      rotator: null,

      // Page state
      selectedLesson: null,
      showCart: false,

      // Cart + checkout data
      cart: [],
      // I keep name for later if needed; phone is used; email stored separately
      customer: { name: "", phone: "" },
      customerEmail: "",

      // Search + sort (persisted)
      searchText: "",
      selectedSort: "default",

      // Lessons seed data (each starts with 5 spaces)
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
    // Total items in cart
    cartCount: function () {
      var total = 0;
      for (var i = 0; i < this.cart.length; i = i + 1) {
        total = total + this.cart[i].qty;
      }
      return total;
    },

    // Total price for all items
    grandTotal: function () {
      var sum = 0;
      for (var i = 0; i < this.cart.length; i = i + 1) {
        sum = sum + (this.cart[i].price * this.cart[i].qty);
      }
      return sum;
    },

    // Filter by subject OR location (case-insensitive)
    filteredLessons: function () {
      var term = this.searchText.trim().toLowerCase();
      if (term == "") {
        return this.lessons;
      }
      var out = [];
      for (var i = 0; i < this.lessons.length; i = i + 1) {
        var l = this.lessons[i];
        var s = l.subject.toLowerCase();
        var loc = l.location.toLowerCase();
        if (s.indexOf(term) != -1 || loc.indexOf(term) != -1) {
          out.push(l);
        }
      }
      return out;
    }
  },

  methods: {
    /* ---------- persistence ---------- */
    // I save cart and toolbar prefs so they survive page refresh.
    saveCart: function () {
      try {
        localStorage.setItem('asa_cart', JSON.stringify(this.cart));
      } catch (e) {
        console.warn('Could not save cart:', e);
      }
    },
    savePrefs: function () {
      try {
        localStorage.setItem('asa_sort', this.selectedSort);
        localStorage.setItem('asa_search', this.searchText);
      } catch (e) {
        console.warn('Could not save prefs:', e);
      }
    },
    clearSearch: function () {
      this.searchText = "";
      this.savePrefs();
    },

    // When I restore the cart, I rebuild lesson spaces from it.
    applyCartToLessons: function () {
      var i;
      for (i = 0; i < this.lessons.length; i = i + 1) {
        this.lessons[i].spaces = 5;
      }
      for (i = 0; i < this.cart.length; i = i + 1) {
        var item = this.cart[i];
        var lesson = this.getLessonById(item.id);
        if (lesson) {
          var newSpaces = lesson.spaces - item.qty;
          if (newSpaces < 0) {
            lesson.spaces = 0;
          } else {
            lesson.spaces = newSpaces;
          }
        }
      }
    },

    /* ---------- helpers ---------- */
    getLessonById: function (id) {
      for (var i = 0; i < this.lessons.length; i = i + 1) {
        if (this.lessons[i].id === id) {
          return this.lessons[i];
        }
      }
      return null;
    },

    /* ---------- sorting ---------- */
    // I sort the list in-place based on the selected option.
    sortLessons: function () {
      if (this.selectedSort == "price") {
        this.lessons.sort(function (a, b) { return a.price - b.price; });
      } else if (this.selectedSort == "availability") {
        this.lessons.sort(function (a, b) { return b.spaces - a.spaces; });
      } else if (this.selectedSort == "location") {
        this.lessons.sort(function (a, b) {
          var A = a.location.toLowerCase();
          var B = b.location.toLowerCase();
          if (A < B) return -1; if (A > B) return 1; return 0;
        });
      } else {
        this.lessons.sort(function (a, b) { return a.id - b.id; });
      }
    },
    onSortChange: function () {
      this.sortLessons();
      this.savePrefs();
    },

    /* ---------- cart + UI ---------- */
    openCart: function () {
      if (this.cartCount == 0) {
        alert("Your cart is empty. Add some lessons first!");
        return;
      }
      this.showCart = true;
    },
    select: function (lesson) {
      this.selectedLesson = lesson;
      this.pause();
    },
    clearSelection: function () {
      this.selectedLesson = null;
      this.play();
    },

    /* ---------- banner controls ---------- */
    next: function () {
      this.currentBanner = (this.currentBanner + 1) % this.banners.length;
    },
    prev: function () {
      this.currentBanner = (this.currentBanner - 1 + this.banners.length) % this.banners.length;
    },
    go: function (i) {
      this.currentBanner = i;
    },
    play: function () {
      if (this.rotator == null) {
        var self = this;
        this.rotator = setInterval(function () { self.next(); }, 4000);
      }
    },
    pause: function () {
      if (this.rotator != null) {
        clearInterval(this.rotator);
        this.rotator = null;
      }
    },

    /* ---------- cart mutations ---------- */
    // Add one to cart and reduce available spaces.
    book: function (lesson) {
      if (lesson.spaces === 0) {
        return;
      }
      var index = -1;
      for (var i = 0; i < this.cart.length; i = i + 1) {
        if (this.cart[i].id === lesson.id) {
          index = i;
        }
      }
      if (index != -1) {
        this.cart[index].qty = this.cart[index].qty + 1;
      } else {
        this.cart.push({ id: lesson.id, subject: lesson.subject, price: lesson.price, qty: 1 });
      }
      lesson.spaces = lesson.spaces - 1;
      this.saveCart();
    },
    increase: function (item) {
      var lesson = this.getLessonById(item.id);
      if (lesson && lesson.spaces > 0) {
        item.qty = item.qty + 1;
        lesson.spaces = lesson.spaces - 1;
        this.saveCart();
      }
    },
    decrease: function (item) {
      var lesson = this.getLessonById(item.id);
      if (!lesson) {
        return;
      }
      if (item.qty > 1) {
        item.qty = item.qty - 1;
        lesson.spaces = lesson.spaces + 1;
        this.saveCart();
      } else {
        this.removeItem(item);
      }
    },
    removeItem: function (item) {
      var lesson = this.getLessonById(item.id);
      if (lesson) {
        lesson.spaces = lesson.spaces + item.qty;
      }
      this.cart = this.cart.filter(function (i) { return i.id != item.id; });
      this.saveCart();
    },

    /* ---------- checkout ---------- */
    // I validate email + phone here (simple, user-friendly regexes).
    checkout: function () {
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((this.customerEmail || "").trim());
      var phoneOk = /^[+]?[\d\s().-]{7,20}$/.test((this.customer.phone || "").trim());

      if (!emailOk || !phoneOk) {
        alert("Please enter a valid Email and Phone.");
        return;
      }
      if (this.cart.length == 0) {
        alert("Your cart is empty.");
        return;
      }

      alert("Order submitted! Thank you.\nEmail: " + this.customerEmail + "\nPhone: " + this.customer.phone);

      // Reset UI and storage
      this.cart = [];
      this.customerEmail = "";
      this.customer.phone = "";
      this.showCart = false;
      this.saveCart();
    },

    // Scroll to top and show lessons
    goHome: function () {
      this.showCart = false;
      this.clearSelection();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },

  mounted: function () {
    // On load I restore state and rebuild spaces from the cart.
    try {
      var savedCart   = localStorage.getItem("asa_cart");
      var savedSort   = localStorage.getItem("asa_sort");
      var savedSearch = localStorage.getItem("asa_search");

      if (savedCart)   { this.cart = JSON.parse(savedCart); }
      if (savedSort)   { this.selectedSort = savedSort; }
      if (savedSearch) { this.searchText = savedSearch; }

      if (this.cart.length > 0) { this.applyCartToLessons(); }
      this.sortLessons();
    } catch (e) {
      console.warn("Could not load saved state:", e);
    }

    this.play();
  }
}
</script>
