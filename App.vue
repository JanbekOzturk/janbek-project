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

const API_BASE_URL = 'http://localhost:4000';

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
      customer: { name: "", phone: "" },
      customerEmail: "",

      // Search + sort (persisted)
      searchText: "",
      selectedSort: "default",

      // Lessons come from the backend now
      // each lesson will be shaped as:
      // { id, subject, location, price, spaces, maxSpaces, img, desc }
      lessons: []
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

    /* ---------- backend checkout helper ---------- */
async sendOrdersToBackend() {
  try {
    for (var i = 0; i < this.cart.length; i = i + 1) {
      var item = this.cart[i];
      var lesson = this.getLessonById(item.id);
      if (!lesson) continue;

      // 1) Create the order
      var orderBody = {
        name: this.customer.name || "Customer",
        phoneNumber: this.customer.phone,
        lessonId: lesson.id, 
        numberOfSpaces: item.qty
      };

      var orderRes = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderBody)
      });

      if (!orderRes.ok) {
        throw new Error("Order failed for " + lesson.subject);
      }

      // 2) Update the backend lesson space
      var putBody = { space: lesson.spaces };

      var putRes = await fetch(`${API_BASE_URL}/api/lessons/${lesson.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(putBody)
      });

      if (!putRes.ok) {
        throw new Error("Failed to update spaces for " + lesson.subject);
      }
    }
  } catch (err) {
    console.error("Error talking to API during checkout:", err);
    throw err;
  }
},


    /* ---------- API ---------- */
    async fetchLessons() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/lessons`);
        if (!response.ok) {
          throw new Error('Failed to load lessons');
        }
        const data = await response.json();

        // Map backend fields -> frontend shape
        this.lessons = data.map(function (l) {
          return {
            id: l._id,                      // MongoDB id
            subject: l.title,               // backend: title
            location: l.location,
            price: l.price,
            spaces: l.space,                // backend: space
            maxSpaces: l.space,             // remember original capacity
            img: 'images/' + (l.image || 'placeholder.jpg'),
            desc: l.description || ''
          };
        });

        // After loading lessons we can re-apply cart reductions
        if (this.cart.length > 0) {
          this.applyCartToLessons();
        }
        this.sortLessons();
      } catch (err) {
        console.error('Error fetching lessons:', err);
        alert('Could not load lessons from the server.');
      }
    },

    /* ---------- persistence ---------- */
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
      // reset to original capacity from backend
      for (i = 0; i < this.lessons.length; i = i + 1) {
        var l = this.lessons[i];
        l.spaces = typeof l.maxSpaces === 'number' ? l.maxSpaces : l.spaces;
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
        // default sort by id from backend
        this.lessons.sort(function (a, b) {
          if (a.id < b.id) return -1;
          if (a.id > b.id) return 1;
          return 0;
        });
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

    /* ---------- checkout (currently still local) ---------- */
    /* ---------- checkout ---------- */
    checkout: async function () {
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

      try {
        // Send orders + update spaces in MongoDB
        await this.sendOrdersToBackend();

        alert(
          "Order submitted to the server! Thank you.\n" +
          "Email: " + this.customerEmail + "\n" +
          "Phone: " + this.customer.phone
        );

        // Reset UI and storage
        this.cart = [];
        this.customerEmail = "";
        this.customer.phone = "";
        this.showCart = false;
        this.saveCart();

        // Refresh lessons from backend to sync new space values
        await this.fetchLessons();
      } catch (err) {
        alert("Something went wrong while saving your order. Please try again.");
      }
    },


    // Scroll to top and show lessons
    goHome: function () {
      this.showCart = false;
      this.clearSelection();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },

  mounted: async function () {
    // Restore local UI state
    try {
      var savedCart   = localStorage.getItem("asa_cart");
      var savedSort   = localStorage.getItem("asa_sort");
      var savedSearch = localStorage.getItem("asa_search");

      if (savedCart)   { this.cart = JSON.parse(savedCart); }
      if (savedSort)   { this.selectedSort = savedSort; }
      if (savedSearch) { this.searchText = savedSearch; }
    } catch (e) {
      console.warn("Could not load saved state:", e);
    }

    // Load lessons from backend, then apply cart + sort
    await this.fetchLessons();

    this.play();
  }
}
</script>
