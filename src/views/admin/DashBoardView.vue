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
              </div></v-toolbar-title
            >

            <!-- <v-spacer></v-spacer> -->

            <v-btn icon>
              <div class="d-flex align-center mr-5">
                <!--   tìm kiếm -->
                <div class="searchBook d-flex align-center mr-5">
                  <!-- Thanh tìm kiếm -->
                  <v-text-field
                    v-if="isSearchVisible"
                    v-model="searchQuery"
                    placeholder="Tìm kiếm sách, tác giả, thể loại..."
                    class="search-input"
                  ></v-text-field>
                  <!-- Icon tìm kiếm -->
                  <v-btn icon @click="toggleSearch">
                    <v-icon>mdi-magnify</v-icon>
                  </v-btn>

                  <!-- icon logout -->
                  <v-btn icon @click="onLogoutClick">
                    <v-icon>mdi-logout</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-btn>
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
            <span v-if="!isLargeScreen">{{ userInfo.name }}</span>
            <span v-if="!isLargeScreen" class="mx-2">|</span>
            <span v-if="!isLargeScreen">Role: {{ userInfo.role }}</span>
          </div>
          <v-tabs v-model="tab" color="primary" direction="vertical">
            <v-tab value="option-1" class="title-func">Quản lý sách</v-tab>
            <v-tab value="option-2" class="title-func">Quản lý mượn trả sách</v-tab>
            <v-tab value="option-3" class="title-func">Thống kê sách yêu thích</v-tab>
            <v-tab value="option-4" class="title-func" @click="goHome">Trang chủ</v-tab>
          </v-tabs>
        </v-navigation-drawer>

        <!-- Tabs chỉ hiện ở giao diện lớn -->
        <v-tabs
          v-model="tab"
          color="primary"
          direction="vertical"
          class="tabs-full-height tabs-narrow"
          :class="{
            'd-none': !isLargeScreen, // Ẩn tab khi màn hình nhỏ
            'd-block': isLargeScreen, // Hiển thị tab khi màn hình lớn
          }"
        >
          <v-tab value="option-1" class="title-func">Quản lý sách</v-tab>
          <v-tab value="option-2" class="title-func">Quản lý mượn trả sách</v-tab>
          <v-tab value="option-3" class="title-func">Thống kê sách yêu thích</v-tab>
          <v-tab value="option-4" class="title-func" @click="goHome" >Trang chủ</v-tab>
        </v-tabs>

        <!-- Nội dung các tab bên phải -->
        <v-tabs-window v-model="tab" class="tabs-window-full-width mt-1">
          <v-tabs-window-item value="option-1">
            <v-card flat>
              <v-card-text rounded="sm">
                <ManagerBookView />
              </v-card-text>
            </v-card>
          </v-tabs-window-item>

          <v-tabs-window-item value="option-2">
            <v-card flat>
              <v-card-text>
                <BorrowBookView />
              </v-card-text>
            </v-card>
          </v-tabs-window-item>

          <v-tabs-window-item value="option-3">
            <v-card flat>
              <v-card-text>
                <StatisticalBookView />
              </v-card-text>
            </v-card>
          </v-tabs-window-item>
        </v-tabs-window>
      </div>

      <!-- Kết quả tìm kiếm -->
      <div class="search-results" v-if="isSearchVisible">
        <v-card v-if="filteredBooks.length > 0">
          <v-card-title>Danh sách tìm thấy</v-card-title>
          <v-list>
            <v-list-item-group v-for="book in filteredBooks" :key="book.id">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{ book.nameBook }}</v-list-item-title>
                  <v-list-item-subtitle
                    >{{ book.nameAuthor }} - {{ book.category }}</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>

        <!-- Thông báo nếu không có kết quả -->
        <v-card v-else>
          <v-card-title>Không tìm thấy sách phù hợp</v-card-title>
        </v-card>
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
import ManagerBookView from './ManagerBookView.vue'
import BorrowBookView from './BorrowBookView.vue'
import StatisticalBookView from './StatisticalBookView.vue'
import type { IUserInfor } from '../../interface/user/user'
import type { IBooks } from '../../interface/product/product'
import router from '../../router'
import { useDisplay } from 'vuetify' // Import useBreakpoint từ Vuetify

const display = useDisplay()

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
  localStorage.getItem
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

const isLargeScreen = ref(true) // Biến kiểm tra kích thước màn hình

// Hàm kiểm tra kích thước màn hình
const checkScreenSize = () => {
  isLargeScreen.value = window.innerWidth >= 1264 // Kiểm tra màn hình lớn
}

// Kiểm tra kích thước khi mounted
onMounted(() => {
  checkScreenSize() // Gọi hàm kiểm tra ngay khi component mounted
  window.addEventListener('resize', checkScreenSize) // Lắng nghe sự kiện resize
})

// Dọn dẹp sự kiện khi component bị hủy
onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})


const goHome = () => {
window.location.href='/home'
}
onMounted(() => {
  const storedUser = localStorage.getItem('user')
  const books = JSON.parse(localStorage.getItem('books') || '[]')

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
  width: 330px;
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
  width: 330px;
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
</style>
