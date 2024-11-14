<template>
  <v-app>
    <v-container fluid>
      <!-- Nav -->
      <v-card class="full-width">
        <!-- Toolbar hiển thị thông tin người dùng -->
        <div>
          <v-toolbar
            image="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
            dark
            prominent
          >
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

            <v-toolbar-title>
              <div class="d-flex align-center" style="margin-left: 5px">
                <span v-if="isLargeScreen">{{ userInfo.name }}</span>
                <span v-if="isLargeScreen" class="mx-2">|</span>
                <span v-if="isLargeScreen">Role: {{ userInfo.role }}</span>
              </div>
              </v-toolbar-title
            >




          </v-toolbar>
        </div>
      </v-card>

      <div class="d-flex full-height">
        <!-- Navigation Drawer chỉ hiện ở giao diện nhỏ -->
        <v-navigation-drawer
          v-model="drawer"
          app
          :mobile-breakpoint="1264"
          temporary
          class="tabs-full-height tabs-narrow"
        >
        <div class="d-flex align-center" style="margin-left: 5px">
                <span v-if="!isLargeScreen" >{{ userInfo.name }}</span>
                <span v-if="!isLargeScreen" class="mx-2">|</span>
                <span v-if="!isLargeScreen">Role: {{ userInfo.role }}</span>
              </div>
          <v-tabs v-model="tab" color="primary" direction="vertical">
            <v-tab value="option-1" class="title-func">Trang chủ</v-tab>
            <!-- <v-tab value="option-2" class="title-func">Sản ph</v-tab> -->
            <v-tab value="option-2" class="title-func">Giỏ sách </v-tab>
            <v-tab value="option-3" class="title-func">Tài khoản</v-tab>
            <v-tab value="option-4" class="title-func" v-if="userInfo.role==='admin'" @click="goDashBorard">Dashboard</v-tab>

            <v-tab class="title-func" @click="onLogoutClick">Đăng Xuất </v-tab>

          </v-tabs>
        </v-navigation-drawer>




        <!-- Nội dung các tab bên phải -->
        <v-tabs-window v-model="tab" class="tabs-window-full-width mt-1">
          <v-tabs-window-item value="option-1">
            <v-card flat>
              <v-card-text rounded="sm">
                <BookView    />
                <!-- Option book -->
              </v-card-text>
            </v-card>
          </v-tabs-window-item>

          <v-tabs-window-item value="option-2">
            <v-card flat>
              <v-card-text>
                <OrderView />
                <!-- option  Order   -->

              </v-card-text>
            </v-card>
          </v-tabs-window-item>

          <v-tabs-window-item value="option-3">
            <v-card flat>
              <v-card-text>
                <Profile />
                <!-- Option Account -->

              </v-card-text>
            </v-card>
          </v-tabs-window-item>
        </v-tabs-window>
      </div>



      <v-snackbar
        v-model="showNotification"
        :color="notificationColor"
        timeout="3000"
        class="custom-snackbar"
      >
        {{ notificationMessage }}
      </v-snackbar>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'

import type { IUserInfor } from '../../interface/user/user'
import type { IBooks } from '../../interface/product/product'
import router from '../../router'
import BookView from '../layouts/BookView.vue'
import OrderView from'../layouts/OrderView.vue'
import Profile from'../user/ProfileView.vue'



const tab = ref('option-1')
const userInfo = ref<IUserInfor>({ name: '', role: '' })

// ===============responsive======================
const drawer = ref(false)
// ===============responsive======================

// chức năng search================
const searchQuery = ref('')
const isSearchVisible = ref(false) // Trạng thái hiển thị thanh tìm kiếm

// Danh sách sách lấy từ localStorage
const books = JSON.parse(localStorage.getItem('books') || '[]')

// Lọc sách theo từ khóa tìm kiếm
const filteredBooks = computed(() => {
  const queryValue = searchQuery.value.trim().toLowerCase()

  if (!queryValue) {
    return [] // Không hiển thị sách nếu không có từ khóa tìm kiếm
  }

  return books.filter((book: IBooks) => {
    return (
      book.nameBook.toLowerCase().includes(queryValue) ||
      book.nameAuthor.toLowerCase().includes(queryValue) ||
      book.category.toLowerCase().includes(queryValue)
    )
  })
})
const toggleSearch = () => {
  // Đổi trạng thái hiển thị thanh tìm kiếm
  isSearchVisible.value = !isSearchVisible.value
  // Xóa từ khóa tìm kiếm khi ấn nút xóa
  searchQuery.value = ''
}

// =============================

const onLogoutClick = () => {
  localStorage.removeItem('user')
  notificationMessage.value = 'Đã đăng xuất'
  notificationColor.value = 'green'
  showNotification.value = true
  setTimeout(() => {
    router.push('/login')
  }, 500)
  // Redirect to login page
}

// Quản lý thông báo
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationColor = ref('')

const isLargeScreen = ref(true)  // Biến kiểm tra kích thước màn hình

// Hàm kiểm tra kích thước màn hình
const checkScreenSize = () => {
  isLargeScreen.value = window.innerWidth >= 1264  // Kiểm tra màn hình lớn
}

// Kiểm tra kích thước khi mounted
onMounted(() => {
  checkScreenSize()  // Gọi hàm kiểm tra ngay khi component mounted
  window.addEventListener('resize', checkScreenSize)  // Lắng nghe sự kiện resize
})

// Dọn dẹp sự kiện khi component bị hủy
onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})


const goDashBorard =()=>{
  if(userInfo.value.role==='admin'){
    router.push('/dashboard')
  }
}

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    userInfo.value = JSON.parse(storedUser)
  }
})
</script>

<style scoped>
.mx-2 {
  margin-left: 8px;
  margin-right: 8px;
}
.full-width {
  max-width: 100%;
}

.full-height {
  height: 100%;
}

.tabs-full-height {
  height: 100%;
  padding: 0; /* Loại bỏ padding */
}

.tabs-window-full-width {
  flex: 1;
  width: 100%;
}

.tabs-narrow {
  width: 300px; /* Điều chỉnh giá trị này theo nhu cầu */
  max-width: 250px;
}
.search-results {
  position: fixed;
  top: 0;
  right: 0;
  width: 270px;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 9999 !important;
  margin-top: 60px;
  margin-right: 65px;
  max-height: 80%; /* Đặt chiều cao tối đa */
  overflow-y: auto; /* Thêm thanh cuộn dọc */

}
.searchBook {
  position: relative;
  display: flex;
  align-items: center;
}
.search-input {
  transition: transform 0.3s ease; /* Hiệu ứng di chuyển cho thanh tìm kiếm */
  position: absolute;
  right: 50px; /* Đảm bảo thanh input sẽ xuất hiện từ vị trí bên phải */
  width: 270px;
}

.searchBook.show .search-input {
  transform: translateX(-100%); /* Di chuyển sang trái khi thanh tìm kiếm hiển thị */
}

.title-func {
  font-weight: 600; /* Chữ đậm */
  letter-spacing: -0.5px; /* Chữ sát gần lại */
  padding: 4px 8px; /* Điều chỉnh padding nếu cần */
  margin: 0; /* Bỏ khoảng cách giữa các tab */
  line-height: 1.2; /* Chiều cao dòng thấp hơn */
}




.custom-snackbar {
  position: fixed !important;
  top: 60px;
  right: 200px;
  bottom: auto !important;
  left: auto !important;
}

@media (max-width: 1264px) {
  .d-flex.align-center {
    display: none; /* Ẩn thông tin người dùng khi màn hình nhỏ */
  }
}
</style>
