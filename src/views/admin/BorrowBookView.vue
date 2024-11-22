<template>
  <div class="container">
    <div class="header-br">
      <h2>Thông tin mượn trả sách</h2>
      <!-- <button class="btn-new">+ Thêm mới</button> -->
      <!-- thêm mới ở đây -->
    </div>
    <table class="Borrow__table-list">
      <tr class="Borrow__table-header">
        <th class="text-left">Số thứ tự</th>
        <th class="text-left" style="width: 400px;">Tên sách</th>
        <th class="text-left">Người mượn</th>
        <th class="text-left">
          <v-combobox
            v-model="selectedStatus"
            width="150px"
            label="Tình trạng"
            :items="['Tất cả', ...action]"
          ></v-combobox>
        </th>
        <th class="text-left">Ngày mượn</th>
        <th class="text-left">Ngày trả</th>
        <th class="text-left">thuộc tính</th>
      </tr>
      <tr class="Borrow__table-header" v-for="(order, index) in filterOrder" :key="order.idBook">
  <td height="50px">{{ index + 1 }}</td>
  <td>{{ order.nameBook }}</td>
  <td>{{ order.nameUser }}</td>
  <!-- Áp dụng lớp CSS cho trạng thái -->
  <td>
    <span
      class="status"
      :class="{
        borrowed: order.action === 'Đã mượn',
        returned: order.action === 'Đã trả',
        overdue: order.action === 'Quá hạn',
      }"
    >
      {{ order.action }}
    </span>
  </td>
  <td>{{ order.borrowedDate }}</td>
  <td>{{ order.paymentDate }}</td>
  <td>
    <v-btn
      v-if="order.action == 'Đã mượn'"
      color="primary"
      @click="ConfirmationOfBookReturn(order.idBook)"
    >
      Xác nhận
    </v-btn>
  </td>
</tr>
    </table>
  </div>
</template>
<script setup lang="ts">

import { computed, onMounted, reactive, ref } from 'vue'
import type { IOrder } from '../../interface/order/order'

const action = ref(['Quá hạn', 'Đã mượn', 'Đã trả'])
const arrOrders = ref<IOrder[]>([])
const selectedStatus = ref('Tất cả') // Giá trị mặc định là "Tất cả"


const formatDate = (date:Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // Tháng bắt đầu từ 0
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
// Khởi tạo dữ liệu localStoregae
const initialOrder  = () => {
  const storeOrders = JSON.parse(localStorage.getItem('orders') || '[]')
  arrOrders.value = Array.isArray(storeOrders) ? storeOrders : []
}


// Hàm xác nhận trạng thái mượn trả
const ConfirmationOfBookReturn = (index: number) => {
  const currentDay = new Date()
  const order = arrOrders.value[index] // Truy cập phần tử theo index

  if (order && order.action === 'Đã mượn') {
    const returnDate = new Date(order.paymentDate)
    if (returnDate < currentDay) {
      order.action = 'Quá hạn'
      order.paymentDate = formatDate(currentDay)
    } else {
      order.action = 'Đã trả'
      order.paymentDate = formatDate(currentDay)
    }
  }
  // Cập nhật lại vào localStorage
  localStorage.setItem('orders', JSON.stringify(arrOrders.value))
}

const filterOrder = computed(() => {
  if (selectedStatus.value === 'Tất cả') {
    return arrOrders.value
  }
  return arrOrders.value.filter((order) => order.action === selectedStatus.value)
})

onMounted(() => {
  initialOrder()
})
</script>

<style scoped>
.container {
  background-color: #f5f5f5;
  padding: 30px;
  border-radius: 10px;
  user-select: none;
}
.header-br {
  display: flex;
  justify-content: space-between;
}
.btn-new {
  background-color: #50ad54;
  color: white;
  padding: 12px;
  border-radius: 5px;
  transition: 200ms;
}
.btn-new:hover {
  box-shadow: 2px 2px 10px 5px rgba(128, 193, 31, 0.299);
  transform: translateY(-2px);
}
.Borrow__table-list {
  width: 100%;
  border-collapse: collapse;
  user-select: none;
}

.Borrow__table-list tr {
  border-bottom: 1px solid #ccc;
}

.Borrow__table-list tr:last-child {
  border-bottom: none;
}

.Borrow__table-list td {
  padding: 10px 10px;
}
.Borrow__table-header td {
  text-align: left;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

/* Màu sắc và hiệu ứng cho các trạng thái */
.status {
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 5px;
  display: inline-block;
  transition: all 0.3s ease;
}

/* Chỉnh độ dài cố định và căn giữa nội dung */
.status {
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 5px;
  display: inline-block;
  text-align: center;
  min-width: 100px; /* Độ dài tối thiểu */
  max-width: 120px; /* Độ dài tối đa */
  transition: all 0.3s ease;
}

/* Màu sắc theo trạng thái */
.status.borrowed {
  background-color: #d0ebff;
  color: #0056b3;
}

.status.returned {
  background-color: #d4edda;
  color: #155724;
}

.status.overdue {
  background-color: #f8d7da;
  color: #721c24;
}

/* Hiệu ứng hover */
.status:hover {
  transform: scale(1.1);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
}

/* Table header style */
.Borrow__table-header th {
  text-transform: uppercase;
  font-weight: bold;
  background-color: #f8f9fa;
  padding: 10px;
}
</style>

