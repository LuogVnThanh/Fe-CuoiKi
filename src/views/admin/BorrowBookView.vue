<template>
  <div class="container">
    <div class="header-br">
      <h2>Thông tin mượn trả sách</h2>
      <button class="btn-new">+ Thêm mới</button>
      <!-- thêm mới ở đây -->
    </div>
    <table class="Borrow__table-list">
      <tr class="Borrow__table-header">
        <th class="text-left" >Số thứ tự</th >
        <th class="text-left" >Tên sách</th >
        <th class="text-left" >Người mượn</th >
        <th class="text-left" > <v-combobox
              v-model="selectedStatus"
              width="150px"
              label="Tình trạng"
              :items="['Tất cả', ...action]"
            ></v-combobox></th >
        <th class="text-left" >Ngày mượn</th >
        <th class="text-left" >Ngày trả</th >
        <th class="text-left" >thuộc tính</th >
      </tr>
      <tr  class="Borrow__table-header" v-for="(order,index) in fillterOrder" :key="order.idbook">
        <td height="50px">{{index+1}}</td>
        <td>{{ order.nameBook }}</td>
        <td>{{ order.nameUser }}</td>
        <td>{{ order.action }}</td>
        <td>{{ order.borrowedDate }}</td>
        <td>{{ order.paymentDate }}</td>
        <td >
          <v-btn v-if="order.action == 'Đã mượn'"  @click="ConfirmationOfBookReturn(order.idBook)">
            xác nhận
          </v-btn>
        </td>
      </tr>
    </table>
  </div>
</template>
<style scoped>
.container {
  background-color: #f5f5f5;
  padding: 30px;
  border-radius: 10px;
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
</style>

<script setup lang="ts">
import { stringify } from 'querystring';
import { json } from 'stream/consumers';
import { computed, onMounted, reactive, ref,   } from 'vue'
import { IOrder } from "../../interface/order/order";

const action = ['Quá hạn', 'Đã mượn', 'Đã trả']
const arrOrders = ref<IOrder[]>([]);
const selectedStatus = ref('Tất cả') // Giá trị mặc định là "Tất cả"

const inittialOrder = () => {
  const storeOrders = JSON.parse(localStorage.getItem('orders') || '[]')
  arrOrders.value = Array.isArray(storeOrders) ? storeOrders : []
  console.log('Loaded orders:', arrOrders.value)
}

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

const ConfirmationOfBookReturn = (id) =>
{

  var orders = JSON.parse(localStorage.getItem('orders'));
  if(orders)
  {
    const currentDay = new Date();
    orders = orders.map((order) => {
      if(order.idBook == id && order.action == 'Đã mượn')
      {
        const returnDate = new Date(order.paymentDate);
        if(returnDate < currentDay){
          return {...order, action: 'Quá hạn',paymentDate:formatDate( currentDay)}
        }
        return {...order, action: 'Đã trả', paymentDate: formatDate( currentDay)}
      }
      return order;
    })
    localStorage.setItem('orders' , JSON.stringify(orders));
    console.log("Cập nhật thành công:", orders);
  } 
  else 
  {
    console.log("Không tìm thấy danh sách orders!");
  }

}

const fillterOrder = computed(() => {
  if (selectedStatus.value === 'Tất cả') {
    return arrOrders.value
  }
  return arrOrders.value.filter((order) => order.action === selectedStatus.value)
});

onMounted(() =>{
  inittialOrder();
});

</script>
