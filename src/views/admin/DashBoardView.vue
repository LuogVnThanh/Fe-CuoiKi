<template>
  <v-container fluid>
    <v-card class="full-width">
      <!-- Toolbar hiển thị thông tin người dùng -->
      <v-toolbar color="primary"  elevation="0" >
        <div v-if="userInfo" class="d-flex align-center justify-space-between" style="width: 100%">
          <div class="d-flex align-center" style="margin-left: 5px">
            <span>{{ userInfo.name }}</span>
            <span class="mx-2">|</span>
            <span>Role: {{ userInfo.role }}</span>
          </div>
          <div class="d-flex align-center mr-5">
            <!--   tìm kiếm -->
            <div class="searchBook d-flex align-center mr-5">
              <!-- Thanh tìm kiếm -->
              <v-text-field
                v-if="isSearchVisible"
                v-model="searchQuery"
                placeholder="Tìm kiếm sách, tác giả, thể loại..."
                style="width: 300px"
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
        </div>
      </v-toolbar>
    </v-card>

    <div class="d-flex full-height">
      <!-- Tabs bên trái -->
      <v-tabs v-model="tab" color="primary" direction="vertical" class="tabs-full-height tabs-narrow" >
        <v-tab value="option-1" class="title-func">Quản lý sách</v-tab>
        <v-tab value="option-2" class="title-func">Quản lý mượn trả sách</v-tab>
        <v-tab value="option-3" class="title-func">Thống kê sách yêu thích</v-tab>
      </v-tabs>

      <!-- Nội dung các tab bên phải -->
      <v-tabs-window v-model="tab" class="tabs-window-full-width mt-1 "   >
        <v-tabs-window-item value="option-1">
          <v-card flat  >
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
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import ManagerBookView from './ManagerBookView.vue'
import BorrowBookView from './BorrowBookView.vue'
import StatisticalBookView from './StatisticalBookView.vue'
import type { IUserInfor } from '../../interface/user/user'
import type { IBooks } from '../../interface/product/product'
import router from '@/router'

const tab = ref('option-1')
const userInfo = ref<IUserInfor>({ name: '', role: '' })

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
  searchQuery.value = '';
}

// =============================

const onLogoutClick = () => {
  localStorage.removeItem('user')
  notificationMessage.value = 'Đã đăng xuất'
    notificationColor.value = 'green'
    showNotification.value = true;
  setTimeout(() => {
        router.push('/login')
      }, 1000)
  // Redirect to login page
}


// Quản lý thông báo
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationColor = ref('')

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
  width: 300px;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 9999 !important;
  margin-top: 60px;
  margin-right: 150px;
  max-height: 80%; /* Đặt chiều cao tối đa */
  overflow-y: auto; /* Thêm thanh cuộn dọc */
}
.searchBook {
  position: relative;
}

.title-func{
  font-weight: 600;         /* Chữ đậm */
  letter-spacing: -0.5px;    /* Chữ sát gần lại */
  padding: 4px 8px;          /* Điều chỉnh padding nếu cần */
  margin: 0;                 /* Bỏ khoảng cách giữa các tab */
  line-height: 1.2;          /* Chiều cao dòng thấp hơn */
}






.custom-snackbar {
  position: fixed !important;
  top: 60px;
  right: 200px;
  bottom: auto !important;
  left: auto !important;
}

</style>
