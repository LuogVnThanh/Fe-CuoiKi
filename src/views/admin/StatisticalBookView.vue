<template>
  <div class="container">
    <h2>BẢNG THỐNG KÊ</h2>
    <div class="thong-ke">
      <!-- trái -->
      <div class="thong-ke__pr">
        <!-- 1 -->
        <div class="thong-ke__list bg__section">
          <div class="thong-ke__soluong">
            <h2 class="thong-ke__dem"> {{ totalUserBorrow}}</h2>
            <img src="" alt="" />
          </div>
          <p class="thong-ke__content">Số Người Mượn</p>
        </div>
        <!-- 2 -->
        <div class="thong-ke__list bg__section">
          <div class="thong-ke__soluong">
            <h2 class="thong-ke__dem"> {{totalBookBorrow}}</h2>
            <img src="" alt="" />
          </div>
          <p class="thong-ke__content">Số Sách Mượn</p>
        </div>
        <!-- 3 -->
        <div class="thong-ke__list bg__section">
          <div class="thong-ke__soluong">
            <h2 class="thong-ke__dem">324{{}}</h2>
            <img src="" alt="" />
          </div>
          <p class="thong-ke__content">Sách Quá Hạn</p>
        </div>
      </div>
      <!-- giữa... Khách vip -->
      <div class="KhachVip">
        <h3 class="khachvip-year">TOP KHÁCH VIP</h3>
        <div class="khachvip-pd"  v-for="(user) in totalTopUserBorrow" :key="user.idUser">
          <p >  {{ user.nameUser }} - {{ user.count }} lần mượn</p>
        </div>
      </div>
      <!-- phải....Top sách yêu thích -->
      <div class="sachyeuthich">
        <div class="sachyeuthich-pd">
          <div class="sachyeuthichtheo">
            <h3>TOP SÁCH YÊU THÍCH</h3>
            <div class="sach-sl">
              <v-select
                v-model="dfSelect"
                label="Thống kê theo"
                :items="['Tuần', 'Tháng', 'Quý', 'Năm']"
              ></v-select>
            </div>
          </div>
          <!-- Table sắp xếp Rank sách -->

          <v-table height="300px" class="table-mobile">
            <thead>
              <tr>
                <th class="text-left">Hạng</th>
                <th class="text-left">Id Sách</th>

                <th class="text-left ">Tên Sách</th>
                <th class="text-left">Số lượng</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in bookStatistics" :key="item.idBook">
                <td>{{ index + 1 }}</td>
                <td>{{ item.idBook }}</td>
                <td class="nameBookMobile">{{ item.nameBook }}</td>
                <td>{{ item.count }}</td>
              </tr>
            </tbody>
          </v-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
const dfSelect = ref('Tuần')

const arrOrders = ref<any[]>([])
const arrUsers = ref<any[]>([])

// Thốn kê số sách mượn
const totalBookBorrow = computed(()=>
  arrOrders.value.length
);

// Thống kê số sách đc mượn nhiều
const bookStatistics = computed(() => {
  const countBook: Record<number, { count: number; nameBook: string }> = {}

  arrOrders.value.forEach((order) => {
    const { idBook, nameBook } = order
    if (!countBook[idBook]) {
      countBook[idBook] = { count: 0, nameBook }
    }
    countBook[idBook].count++
  })
  // Sắp xếp theo số lần mượn giảm dần
  return Object.entries(countBook)
    .map(([idBook, data]) => ({ idBook: +idBook, ...data }))
    .sort((a, b) => b.count - a.count)
})

//Thống kê số người mượn
const totalUserBorrow = computed(()=>{
  const userIds = new Set(arrOrders.value.map(order => order.idUser))
  return userIds.size
})

// Lọc số người mượn nhiều
const totalTopUserBorrow = computed(()=>{
  const countUser: Record<number, { count: number; nameUser: string}> = {}
  arrOrders.value.forEach((user) => {
    const {idUser,nameUser}= user;
     if (!countUser[idUser]) {
      countUser[idUser] = { count: 0, nameUser }
    }
    countUser[idUser].count++
  })

  // Lọc ra số người mượn nhiều hơn 5 lần
  return Object.entries(countUser)
    .map(([idUser, data]) => ({ idUser: +idUser,...data }))
    .filter(user => user.count > 1)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

})


onMounted(() => {
  const storeOrders = JSON.parse(localStorage.getItem('orders') || '[]')
  arrOrders.value = Array.isArray(storeOrders) ? storeOrders : []
})
</script>

<style scoped>
/* thuộc tính chung */
.bg__section {
  background-color: #f5f5f5;
}
h2 {

  font-size: 24px;
  color: #333;
  font-weight: bold;
  margin-bottom: 20px;
}
/* -----------------thống kê trái-------------------- */
.thong-ke__pr {
  width: 17%;
  display: flex;
  flex-direction: column;
  row-gap: 25px;
}
.thong-ke__list {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 15px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}
.thong-ke__list:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.thong-ke__soluong h2 {
  font-size: 32px;
  color: #1868c1;
  margin-bottom: 10px;
}
.thong-ke__content {
  font-size: 16px;
  color: #666666;
  margin: 0;
}
h2 {
  margin-bottom: 0px;
}
/* -----------------thống kê top khách vip-------------------- */
.thong-ke {
  display: flex;
  margin-top: 25px;
  column-gap: 25px;
}
.KhachVip {
  width: 30%;
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Đổ bóng để tạo chiều sâu */
  padding: 20px;
  text-align: center;
}

.khachvip-year {
  font-size: 20px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 15px;
}

.khachvip-pd {
  padding: 15px;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #e0f7fa, #f1f8e9); /* Hiệu ứng gradient nhẹ */
  border-radius: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Hiệu ứng hover */
}

.khachvip-pd:hover {
  transform: translateY(-5px); /* Di chuyển nhẹ khi hover */
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15); /* Tăng bóng */
}

.khachvip-pd p {
  font-size: 16px;
  color: #555555; /* Màu chữ nhẹ nhàng */
  margin: 0;
}

.khachvip-pd p span {
  font-weight: bold;
  color: #ff5722; /* Màu nổi bật cho số lần mượn */
}

/* -----------------Sách yêu thích------------------- */
.sachyeuthich {
  background-color: #f5f5f5;
  width: 52%;
  border-radius: 15px;
}
.sachyeuthich-pd {
  padding: 20px;
}
.sachyeuthichtheo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.sachyeuthich-sl {
  text-align: center;
  padding: 5px 9px;
  background-color: #1868c1;
  color: white;
  border-radius: 5px;
  transition: 0.3s;
}
.sachyeuthich-sl:hover {
  box-shadow: 3px 3px 3px 3px rgba(0, 0, 0, 0.2);
}
.sach-sl {
  width: 30%;
}
.table-mobile{
  height: 500px;
}
.table-mobile th,
.table-mobile td {

  text-align: left;
  padding: 12px 10px;
  border-bottom: 1px solid #ddd;
}

.table-mobile th {
  background-color: #1868c1;
  color: white;
  font-size: 16px;
}

.table-mobile tbody tr:hover {
  background-color: #f5f5f5;
}

.nameBookMobile {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* ----------------------responsive----------------------- */
@media (max-width: 991.98px) {
  .thong-ke {
    flex-direction: column;
  }
  .nameBookMobile {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .thong-ke__pr {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    width: 100%;
  }
  .KhachVip {
    margin-top: 20px;
    width: 100%;
    height: 470px;
  }
  .khachvip-year {
    text-align: center;
  }
  .sachyeuthich {
    width: 100%;
    height: 700px;
    margin-top: 20px;
  }
  .sachyeuthichtheo {
    flex-direction: column;
    align-items: center;
    row-gap: 10px;
  }
  .sach-sl {
    width: 50%;
  }
  .table-mobile {
    font-size: 14px;
  }
}
</style>
<!-- Báo cáo và thống kê: Cung cấp các báo cáo về số lượng sách, lượt mượn, tỷ lệ trả sách đúng hạn, và
  các thống kê khác. -->
