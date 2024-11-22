<template>
  <div class="container">
    <h2>BẢNG THỐNG KÊ</h2>
    <div class="thong-ke">
      <!-- trái -->
      <div class="thong-ke__pr">
        <!-- 1 -->
        <div class="thong-ke__list bg__section">
          <div class="thong-ke__soluong">
            <h2 class="thong-ke__dem">{{ totalUserBorrow }}</h2>
            <img src="" alt="" />
          </div>
          <p class="thong-ke__content">Số Người Mượn</p>
        </div>
        <!-- 2 -->
        <div class="thong-ke__list bg__section">
          <div class="thong-ke__soluong">
            <h2 class="thong-ke__dem">{{ totalBookBorrow }}</h2>
            <img src="" alt="" />
          </div>
          <p class="thong-ke__content">Số Sách Mượn</p>
        </div>
        <!-- 3 -->
        <div class="thong-ke__list bg__section">
          <div class="thong-ke__soluong">
            <h2 class="thong-ke__dem">{{ totalDelayBorrowBook }}</h2>
            <img src="" alt="" />
          </div>
          <p class="thong-ke__content">Sách Quá Hạn</p>
        </div>
      </div>
      <!-- giữa... Khách vip -->
      <div class="KhachVip">
        <h3 class="khachvip-year">TOP KHÁCH VIP</h3>
        <div class="khachvip-pd" v-for="user in totalTopUserBorrow" :key="user.idUser">
          <p>{{ user.nameUser }} - {{ user.count }} lần mượn</p>
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
                :items="['Tất cả', 'Tuần', 'Tháng', 'Quý', 'Năm']"
              ></v-select>
            </div>
          </div>
          <!-- Table sắp xếp Rank sách -->

          <div class="table-container">
            <v-table height="300px" class="table-mobile">
              <thead>
                <tr>
                  <th class="text-left">Hạng</th>
                  <th class="text-left">Id Sách</th>

                  <th class="text-left">Tên Sách</th>
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
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)

const dfSelect = ref('Tất cả')
const arrOrders = ref<any[]>([])

// Thốn kê số sách mượn
const totalBookBorrow = computed(() => arrOrders.value.length)

const normalizeDate = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number)
  return dayjs(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`)
}

// Lọc theo thời gian chọn
const filteredOrders = computed(() => {
  const now = dayjs() // Thời gian hiện tại

  return arrOrders.value.filter((order) => {
    const borrowDate = normalizeDate(order.borrowedDate) // Sử dụng hàm chuẩn hóa

    // Kiểm tra tính hợp lệ của borrowDate
    if (!borrowDate.isValid()) {
      console.error(`Ngày không hợp lệ: ${order.borrowedDate}`)
      return false
    }

    // Lọc theo lựa chọn
    switch (dfSelect.value) {
      case 'Tuần':
        const startOfWeek = now.startOf('week') // Bắt đầu tuần
        const endOfWeek = now.endOf('week') // Kết thúc tuần
        return borrowDate.isBetween(startOfWeek, endOfWeek, null, '[]')
      case 'Tháng':
        return borrowDate.month() === now.month() && borrowDate.year() === now.year()
      case 'Quý':
        const currentQuarter = Math.floor(now.month() / 3)
        return (
          Math.floor(borrowDate.month() / 3) === currentQuarter && borrowDate.year() === now.year()
        )
      case 'Năm':
        return borrowDate.year() === now.year()
      default: // 'Tất cả'
        return true
    }
  })
})

// Đếm số lượng sách mượn sau khi đã lọc
const bookStatistics = computed(() => {
  const countBook: Record<number, { count: number; nameBook: string }> = {}

  // Duyệt qua các đơn hàng đã lọc và đếm số lần mượn cho mỗi sách
  filteredOrders.value.forEach((order) => {
    const { idBook, nameBook } = order
    if (!countBook[idBook]) {
      countBook[idBook] = { count: 0, nameBook }
    }
    countBook[idBook].count++
  })

  // Chuyển kết quả thành mảng và sắp xếp theo số lần mượn giảm dần
  return Object.entries(countBook)
    .map(([idBook, data]) => ({ idBook: +idBook, ...data }))
    .sort((a, b) => b.count - a.count)
})

//Thống kê số người mượn
const totalUserBorrow = computed(() => {
  const userIds = new Set(arrOrders.value.map((order) => order.idUser))
  return userIds.size
})
//Thống kê số sách quá hạn
const totalDelayBorrowBook = computed(() => {
  const delayBooks = arrOrders.value.filter((order) => order.action === 'Quá hạn')
  return delayBooks.length
})

// Lọc số người mượn nhiều
const totalTopUserBorrow = computed(() => {
  const countUser: Record<number, { count: number; nameUser: string }> = {}
  arrOrders.value.forEach((user) => {
    const { idUser, nameUser } = user
    if (!countUser[idUser]) {
      countUser[idUser] = { count: 0, nameUser }
    }
    countUser[idUser].count++
  })

  // Lọc ra số người mượn nhiều hơn 5 lần
  return Object.entries(countUser)
    .map(([idUser, data]) => ({ idUser: +idUser, ...data }))
    .filter((user) => user.count > 1)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
})

onMounted(() => {
  const storeOrders = JSON.parse(localStorage.getItem('orders') || '[]')
  arrOrders.value = Array.isArray(storeOrders) ? storeOrders : []
  console.log('Loaded orders:', arrOrders.value)
})
</script>

<style scoped>
/* thuộc tính chung */
/* Căn chỉnh toàn bộ container */
.container {
  margin: 0 auto;
  padding: 20px;
  user-select: none;
}
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
/* Phần thống kê */
.thong-ke {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 20px;
  height: 470px;
}

.thong-ke__pr {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.thong-ke__list {
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s ease-in-out;
}
.thong-ke__list:hover {
  transform: translateY(-5px);
}
.thong-ke__soluong h2 {
  font-size: 32px;
  color: #1868c1;
  margin-bottom: 10px;
}
.thong-ke__content {
  font-size: 16px;
  color: #666;
  margin: 0;
}
h2 {
  margin-bottom: 0px;
}
/* -----------------thống kê top khách vip-------------------- */

.KhachVip {
  width: 30%;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
}

.khachvip-year {
  font-size: 20px;
  color: #333;
  margin-bottom: 15px;
}

.khachvip-pd {
  padding: 15px;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #e0f7fa, #f1f8e9);
  border-radius: 10px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease; /* Hiệu ứng hover */
  overflow-y: auto;
}

.khachvip-pd:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.khachvip-pd p {
  font-size: 16px;
  color: #555555;
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
.table-mobile {
  width: 100%;
  height: 100vh;
}

.table-mobile th,
.table-mobile td {
  text-align: left;
  padding: 10px;
  border: 1px solid #ddd;
}

.table-mobile th {
  /* background-color: #f2f2f2; */
  background-color: #1d6bbf;
  color: #333;
}

.table-mobile tr:hover {
  background-color: #f9f9f9;
}

.nameBookMobile {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ----------------------responsive----------------------- */
@media (max-width: 991.98px) {
  .container {
    padding: 0;
  }
  .thong-ke {
    flex-direction: column;
    height: 100vh;
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
  }
  .thong-ke__list {
    padding: 10px;
  }
  .KhachVip {
    margin-top: 20px;
    width: 100%;
  }
  .khachvip-year {
    text-align: center;
  }
  .sachyeuthich {
    width: 100%;
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
  .table-container {
    max-height: 320px;
    overflow-y: auto; /* Cuộn dọc */
    margin-top: 10px; /* Khoảng cách trên bảng */
  }
  .table-mobile {
    width: 100%;
    border-collapse: collapse; /* Đảm bảo không có khoảng trống giữa các ô */
  }
}
</style>
