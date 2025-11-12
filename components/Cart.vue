<template>
  <div class="cart">
    <!-- Table header -->
    <div class="cart-row cart-head">
      <div>Activity</div>
      <div>Qty</div>
      <div>Price</div>
      <div>Total</div>
      <div></div>
    </div>

    <!-- One row per cart item -->
    <div class="cart-row" v-for="item in cart" :key="item.id">
      <div>{{ item.subject }}</div>

      <!-- Quantity controls -->
      <div class="qty">
        <button type="button" @click="$emit('decrease', item)">−</button>
        <span>{{ item.qty }}</span>
        <button
          type="button"
          @click="$emit('increase', item)"
          :disabled="!hasSpace(item.id)"
        >＋</button>
      </div>

      <div>£{{ item.price }}</div>
      <div>£{{ item.price * item.qty }}</div>

      <div>
        <button type="button" class="remove" @click="$emit('remove', item)">Remove</button>
      </div>
    </div>

    <!-- Cart total -->
    <div class="cart-total">
      Grand total: <strong>£{{ grandTotal }}</strong>
    </div>

    <!-- Checkout section: collects Email + Phone -->
    <section class="checkout">
      <h3 class="checkout-title">Checkout details</h3>

      <label class="field">
        <span>Email</span>
        <input
          type="email"
          :value="email"
          placeholder="you@example.com"
          autocomplete="email"
          inputmode="email"
          @input="$emit('update:email', $event.target.value)"
        />
      </label>

      <label class="field">
        <span>Phone</span>
        <input
          type="tel"
          :value="phone"
          placeholder="+44 7123 456789"
          autocomplete="tel"
          inputmode="tel"
          @input="$emit('update:phone', $event.target.value)"
        />
      </label>

      <!-- App.vue handles validation + submission -->
      <form class="checkout-actions" @submit.prevent="$emit('checkout')">
        <button class="book-btn lg" :disabled="cart.length === 0 || !canCheckout">Checkout</button>
      </form>
    </section>
  </div>
</template>

<script>
export default {
  name: 'CartView',
  props: {
    cart: { type: Array, required: true },
    lessons: { type: Array, required: true },
    grandTotal: { type: Number, required: true },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    canCheckout: { type: Boolean, default: true }
  },
  methods: {
    getLessonById: function (id) {
      for (var i = 0; i < this.lessons.length; i = i + 1) {
        if (this.lessons[i].id === id) return this.lessons[i];
      }
      return null;
    },
    hasSpace: function (id) {
      var lesson = this.getLessonById(id);
      if (!lesson) return false;
      return lesson.spaces > 0;
    }
  },
  emits: ['decrease', 'increase', 'remove', 'checkout', 'update:email', 'update:phone']
}
</script>

<style scoped>
.checkout { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #eee; }
.checkout-title { font-weight: 600; margin-bottom: .5rem; }
.field { display: flex; flex-direction: column; gap: .25rem; margin-bottom: .75rem; }
.field input {
  padding: .6rem .7rem;
  border: 1px solid #ddd;
  border-radius: .6rem;
  outline: none;
}
.field input:focus { border-color: #c6d0c0; box-shadow: 0 0 0 3px rgba(198,208,192,.25); }
.checkout-actions .book-btn.lg:disabled { opacity: .5; cursor: not-allowed; }
</style>
