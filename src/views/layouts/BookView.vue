<template>
  <div>
    <!-- Main Content -->
    <div class="content">
      <main>
        <h2>Thế Giới Sách</h2>

        <!-- Tìm kiếm -->
        <div class="search-bar">
          <input type="text" v-model="searchQuery" placeholder="Tìm kiếm sách..." />
          <button @click="searchBooks">Tìm kiếm</button>
        </div>

        <!-- Nếu không có sách nào phù hợp -->
        <div v-if="noResults" class="no-results-message">
          <p>Không có sản phẩm phù hợp với tìm kiếm của bạn.</p>
        </div>

        <!-- Danh sách sách -->
        <div class="book-grid">
          <div v-for="(book, index) in paginatedBooks" :key="index" class="book-item">
            <img
              :src="book.image"
              alt="Book Cover"
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
              {{ book.nameBook }}
            </h3>
            <p style="height: 20px">Thể loại: {{ book.category }}</p>
            <p style="height: 50px">Tác giả: {{ book.nameAuthor }}</p>
            <button v-if="book.status === 'Sách mới'" @click="openBorrowModal(book)">Mượn</button>
            <button v-if="book.status === 'Đã mượn'" style="background-color: #eeb935" disabled>
              Đã mượn
            </button>
            <button v-if="book.status === 'Hư hỏng'" style="background-color: #f30502" disabled>
              Hư hỏng
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>

  <!-- Modal mượn sách -->
  <v-dialog v-model="isBorrowDialogOpen" max-width="500px">
    <v-card>
      <v-card-title class="text-h5">Thông Tin Mượn Sách</v-card-title>
      <v-card-text>
        <v-form ref="borrowForm" v-model="isFormValid">
          <v-text-field v-model="borrowInfo.idBook" label="ID Sách" readonly></v-text-field>
          <v-text-field v-model="borrowInfo.nameBook" label="Tên Sách" readonly></v-text-field>
          <!-- Tham chiếu tên người mượn và id -->

          <!-- <v-text-field v-model="borrowInfo.idUser" label="ID Người Mượn" readonly></v-text-field> -->
          <v-text-field v-model="borrowInfo.nameUser" label="Tên Người Mượn"></v-text-field>

          <!-- readonly -->
          <!-- Ngày mượn -->
          <v-text-field
            v-model="borrowInfo.borrowedDate"
            label="Ngày Mượn"
            required
            type="date"
            :min="today"
          ></v-text-field>
        </v-form>
      </v-card-text>

      <!-- Các nút hành động -->
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text="" @click="closeBorrowModal">Hủy</v-btn>
        <v-btn
          color="primary"
          text=""
          @click="confirmBorrow"
          :disabled="
            borrowInfo.borrowedDate === ''
            // ||
            // new Date(borrowInfo.PaymentDate) < new Date(borrowInfo.BorrowedDate)
          "
          >Xác Nhận</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Page -->
  <div class="text-center">
    <v-pagination
      v-model="page"
      :length="totalPages"
      @update:modelValue="updatePage"
    ></v-pagination>
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
import { watch, watchEffect } from 'vue'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { IOrder } from '../../interface/order/order'
import type { IBooks } from '../../interface/product/product'
import type { IUser } from '../../interface/user/user'
// Quản lý thông báo
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationColor = ref('')

// Phân trang===============================================
const itemsPerPage = 5 // Số sách trên mỗi trang
const page = ref(1)

// Tổng số trang dựa trên số lượng sách và số sách trên mỗi trang
const totalPages = computed(() => Math.ceil(ListBook.value.length / itemsPerPage))

// Lấy danh sách sách cho trang hiện tại
const paginatedBooks = computed(() => {
  const start = (page.value - 1) * itemsPerPage // (1-1) *5=0
  const end = start + itemsPerPage //0+5
  return ListBook.value.slice(start, end) //0-5
})

// Cập nhật trang hiện tại khi người dùng thay đổi trang
const updatePage = (newPage: number) => {
  page.value = newPage

  // Lấy đối tượng người dùng từ localStorage và cập nhật currentPage
  const User = JSON.parse(localStorage.getItem('user') || '{}')

  if (User && typeof User === 'object') {
    User.currentPage = newPage
    localStorage.setItem('user', JSON.stringify(User))
  }
}
// Khi người dùng đăng nhập thành công, thiết lập `currentPage` trong localStorage

// Phân trang===============================================

// Khai báo các biến
const searchQuery = ref('')
const router = useRouter()
const ListBook = ref<IBooks[]>([])
const noResults = ref(false) // Trạng thái kiểm tra không có kết quả

// Hàm tìm kiếm sách
const searchBooks = () => {
  const storedBooks = JSON.parse(localStorage.getItem('books') || '[]')

  // Kiểm tra nếu ô tìm kiếm trống, lấy toàn bộ dữ liệu từ BookStore
  if (!searchQuery.value) {
    ListBook.value = Array.isArray(storedBooks) ? storedBooks : []
    noResults.value = false
  } else {
    // Nếu có từ khóa, lọc danh sách sách dựa trên searchQuery
    const filteredBooks = storedBooks.filter(
      (book: IBooks) =>
        book.nameBook.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        book.nameAuthor.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        book.category.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
    // Cập nhật danh sách sách tìm được và trạng thái thông báo nếu không có kết quả
    if (filteredBooks.length === 0) {
      noResults.value = true
    } else {
      ListBook.value = filteredBooks
      noResults.value = false
    }
  }
}

// Thông tin mượn sách=======================================
const borrowInfo = ref<IOrder>({
  idBook: 0,
  nameBook: '',
  idUser: 0,
  nameUser: '',
  image: '',
  borrowedDate: '',
  paymentDate: '',
  action: '',
})

// State người dùng và danh sách người dùng
const user = ref<IUser>(JSON.parse(localStorage.getItem('user') || '{}'))

const books = ref<IBooks[]>(JSON.parse(localStorage.getItem('books') || '[]'))
const order = ref<IOrder[]>(JSON.parse(localStorage.getItem('order') || '[]'))
const orders = ref<IOrder[]>(JSON.parse(localStorage.getItem('orders') || '[]'))

// Hàm mở modal và gán thông tin sách
const openBorrowModal = (book: IBooks) => {
  borrowInfo.value.idBook = book.id
  borrowInfo.value.nameBook = book.nameBook
  borrowInfo.value.image = book.image
  borrowInfo.value.action = 'Đã mượn'
  isBorrowDialogOpen.value = true
  // Lấy thông tin người dùng từ localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  // Gán name từ user vào borrowInfo nếu name tồn tại
  borrowInfo.value.idUser = user.id || ''
  borrowInfo.value.nameUser = user.name || ''
}

// Hàm đóng modal
const closeBorrowModal = () => {
  isBorrowDialogOpen.value = false
  borrowInfo.value.borrowedDate = ''
  borrowInfo.value.paymentDate = ''
  isFormValid.value = false
}

// Modal mượn sách=============================================
// Trạng thái mở của modal
const isBorrowDialogOpen = ref(false)
const isFormValid = ref(false)
// Thiết lập ngày hiện tại (dùng cho min ngày mượn)
const today = ref(new Date().toISOString().split('T')[0])

// Hàm xác nhận mượn sách
const confirmBorrow = () => {
  if (borrowInfo.value.borrowedDate === '') {
    // Thông báo lỗi nếu các trường ngày mượn hoặc ngày trả không được điền
    showNotification.value = true
    notificationMessage.value = 'Vui lòng điền đầy đủ thông tin ngày mượn.'
    notificationColor.value = 'error'
    return
  }
  // Nếu ngày trả chưa được điền, tự động đặt là ngày mượn + 7 ngày
  if (borrowInfo.value.borrowedDate) {
    const borrowedDate = new Date(borrowInfo.value.borrowedDate)
    borrowedDate.setDate(borrowedDate.getDate() + 7) // Thêm 7 ngày
    borrowInfo.value.paymentDate = borrowedDate.toISOString().split('T')[0] // Định dạng yyyy-mm-dd
  }

  // Lấy mảng orders hiện tại từ localStorage (hoặc tạo mảng rỗng nếu chưa có)
  const existingOrders = JSON.parse(localStorage.getItem('order') || '[]') as IOrder[]

  existingOrders.push({ ...borrowInfo.value })
  localStorage.setItem('order', JSON.stringify(existingOrders))
  // localStorage.getItem('order')
  const ListOrdersInLocal = JSON.parse(localStorage.getItem('orders') || '[]') as IOrder[]
  ListOrdersInLocal.push({ ...borrowInfo.value })
  localStorage.setItem('orders', JSON.stringify(ListOrdersInLocal))

  // thongbao
  showNotification.value = true
  notificationMessage.value = 'Mượn sách thành công!'
  notificationColor.value = 'success'


  // Đóng modal và reset form
  closeBorrowModal()
}


// Thiết lập trang ban đầu khi đăng nhập
const setInitialPageOnLogin = () => {
  const User = JSON.parse(localStorage.getItem('user') || '{}')
  if (User && User.currentPage) {
    page.value = User.currentPage // Lấy currentPage từ đối tượng trong localStorage
  } else {
    page.value = 1
  }
}


onMounted(() => {
  // Lấy danh sách sách từ localStorage khi thành phần được tải
  const storedBooks = JSON.parse(localStorage.getItem('books') || '[]')
  ListBook.value = Array.isArray(storedBooks) ? storedBooks : []

  // Lấy thông tin người dùng từ localStorage
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
  user.value = storedUser || {}

  // Lấy thông tin order từ localStorage
  const storedOrder = JSON.parse(localStorage.getItem('order') || '[]')

  // Lấy danh sách sách từ localStorage khi thành phần được tải
  const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]')

  // Gọi hàm này khi component được mounted để lấy số trang hiện tại từ localStorage
  setInitialPageOnLogin()
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

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

/* Phần tử sách */
.book-item {
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

.book-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.book-item img {
  width: 100%;
  max-width: 150px;
  height: auto;
  border-radius: 8px;
  margin-bottom: 10px;
}

.book-item h3 {
  font-size: 1.2rem;
  color: #333;
  text-align: center;
  margin: 10px 0;
}

.book-item p {
  font-size: 0.9rem;
  color: #777;
  text-align: center;
  margin-bottom: 15px;
}

/* Nút mượn sách */
.book-item button {
  padding: 8px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.book-item button:hover {
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
