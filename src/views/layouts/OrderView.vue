<template>
  <div>
    <!-- Main Content -->
    <div class="content">
      <main>
        <h2>Giỏ hàng</h2>

        <!-- Danh sách sách -->
        <div class="order-grid">
          <div v-for="(order, index) in listOrder" :key="index" class="order-item">
            <img
              :src="order.image"
              alt="order Cover"
              style="
                height: 200px;
                width: auto;
                object-fit: cover;
                display: block;
                border-radius: 10%; /* Tạo hình tròn */
              "
            />
            <h3
              style="
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                overflow: hidden;
                text-overflow: ellipsis;
              "
            >
              {{ order.nameBook }}
            </h3>


            <p style="height: 50px">Ngày mượn:  <br>
              {{ order.borrowedDate }}</p>
            <p style="height: 50px">Ngày trả: <br>{{ order.paymentDate }}</p>
            <button
              v-if="order.action == 'Đã mượn'"
              style="
                background-color: #4caf50;
                color: white;
                padding: 10px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
              "
            >
              Đã mượn
            </button>
            <button
              v-if="order.action == 'Đã trả'"
              style="
                background-color: #d8d401;
                color: white;
                padding: 10px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
              "
            >
              Đã trả
            </button>
            <button
              v-if="order.action == 'Quá hạn'"
              style="
                background-color: #ff1e00;

                color: white;
                padding: 10px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
              "
            >
                Quá hạn
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>

  <!-- thongbao--->

  <v-snackbar
    v-model="showNotification"
    :color="notificationColor"
    timeout="3000"
    class="custom-snackbar"
  >
    {{ notificationMessage }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { Ref, watch, watchEffect } from 'vue'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { IOrder } from '../../interface/order/order'
import { IBooks } from '../../interface/product/product'

import type { IUser } from '../../interface/user/user'
// Quản lý thông báo
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationColor = ref('')

const listOrder: Ref<IOrder[]> = ref([]) // Danh sách đơn hàng

onMounted(() => {
  const storeOrder = JSON.parse(localStorage.getItem('order') || '[]') as IOrder[]

  // Nếu có dữ liệu đơn hàng
  if (Array.isArray(storeOrder)) {
    listOrder.value = storeOrder
  }
})
</script>

<style scoped>
/* Bố cục tổng quan */
.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Phần tiêu đề chính */
h2 {
  font-size: 2rem;
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

/* Thanh tìm kiếm */
.search-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.search-bar input[type='text'] {
  width: 300px;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
}

.search-bar button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-bar button:hover {
  background-color: #45a049;
}

.order-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

/* Phần tử sách */
.order-item {
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.order-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.order-item img {
  width: 100%;
  max-width: 150px;
  height: auto;
  border-radius: 8px;
  margin-bottom: 10px;
}

.order-item h3 {
  font-size: 1.2rem;
  color: #333;
  text-align: center;
  margin: 10px 0;
}

.order-item p {
  font-size: 0.9rem;
  color: #777;
  text-align: center;
  margin-bottom: 15px;
}

/* Nút mượn sách */
.order-item button {
  padding: 8px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.order-item button:hover {
  background-color: #45a049;
}

/* Footer */
footer {
  text-align: center;
  margin-top: 20px;
  font-size: 0.9rem;
  color: #777;
}

footer p {
  margin: 5px 0;
}

.custom-snackbar {
  position: fixed !important;
  top: 60px;
  right: 200px;
  bottom: auto !important;
  left: auto !important;
}
</style>
