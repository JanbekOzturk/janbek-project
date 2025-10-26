<template>
  <div class="cart">
    <div class="cart-row cart-head">
      <div>Activity</div>
      <div>Qty</div>
      <div>Price</div>
      <div>Total</div>
      <div></div>
    </div>

    <div class="cart-row" v-for="item in cart" :key="item.id">
      <div>{{ item.subject }}</div>

      <div class="qty">
        <button @click="$emit('decrease', item)">−</button>
        <span>{{ item.qty }}</span>
        <button
          @click="$emit('increase', item)"
          :disabled="getLessonById(item.id) && getLessonById(item.id).spaces === 0"
        >＋</button>
      </div>

      <div>£{{ item.price }}</div>
      <div>£{{ item.price * item.qty }}</div>

      <div>
        <button class="remove" @click="$emit('remove', item)">Remove</button>
      </div>
    </div>

    <div class="cart-total">
      Grand total: <strong>£{{ grandTotal }}</strong>
    </div>

    <!-- checkout form lives in App (data + validation), we just trigger it -->
    <form class="checkout" @submit.prevent="$emit('checkout')">
      <button class="book-btn lg" :disabled="cart.length === 0">Checkout</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'CartView',
  props: {
    cart: { type: Array, required: true },
    lessons: { type: Array, required: true },
    grandTotal: { type: Number, required: true }
  },
  methods: {
    getLessonById: function (id) {
      for (var i = 0; i < this.lessons.length; i = i + 1) {
        if (this.lessons[i].id === id) return this.lessons[i];
      }
      return null;
    }
  }
}
</script>
