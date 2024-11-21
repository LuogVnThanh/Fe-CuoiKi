<template>
  <div class="full-width" style="background-color: #f5f5f5; padding: 15px; border-radius: 5px">
    <div class="d-flex justify-space-between mb-10">
      <h2>Danh sách sản phẩm</h2>
      <v-btn prepend-icon="mdi-plus" color="green" class="add-icon" @click="dialog = true">
        Thêm Sách
      </v-btn>
    </div>
    <v-table height="500px" style="background-color: #f5f5f5">
      <thead>
        <tr>
          <th class="text-left">Id</th>
          <th class="text-left">Tên sách</th>
          <th class="text-left">Tên tác giả</th>
          <th class="text-left">Ngày xuất bản</th>
          <th class="text-left">Tên loại</th>
          <th class="text-left">
            <v-combobox
              v-model="selectedStatus"
              width="150px"
              label="Tình trạng"
              :items="['Tất cả', ...status]"
            ></v-combobox>
          </th>

          <th class="text-left">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filteredBooks" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.nameBook }}</td>
          <td>{{ item.nameAuthor }}</td>
          <td>{{ item.publicationBook }}</td>
          <td>{{ item.category }}</td>
          <td>{{ item.status }}</td>
          <td  >
            <v-icon @click="editBook(item.id)" class="mr-2 edit-icon" icon="mdi-pencil"></v-icon>
            <!-- <v-icon @click="deleteBook(item.id)" icon="mdi-delete delete-icon"></v-icon> -->
            <v-icon @click="confirmDelete(item.id)" icon="mdi-delete delete-icon"></v-icon>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>

  <!-- Modal xác nhận xóa -->
  <v-dialog v-model="confirmDeleteDialog" max-width="400" persistent>
    <v-card>
      <v-card-title class="headline">Bạn có chắc muốn xóa sách?</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" @click="confirmDeleteDialog = false">Hủy</v-btn>
        <v-btn color="red" @click="deleteBook">Xóa</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Modal thêm và sửa sách -->
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ isEdit ? 'Sửa sáh' : 'Thêm Sách Mới' }}</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="form">
          <!-- Hàng Tên Sách và Tên Tác Giả -->
          <v-row>
            <v-col cols="6">
              <v-text-field v-model="newBook.nameBook" label="Tên Sách*" required></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="newBook.nameAuthor"
                label="Tên Tác Giả*"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Hàng Ngày Xuất Bản -->
          <v-text-field
            v-model="newBook.publicationBook"
            label="Ngày Xuất Bản*"
            required
            type="date"
          ></v-text-field>
          <!-- Hàng Loại Sách và Tình Trạng -->
          <v-row>
            <v-col cols="6">
              <v-combobox
                v-model="newBook.category"
                label="Loại Sách*"
                :items="categories"
                required
              ></v-combobox>
            </v-col>
            <v-col cols="6">
              <v-combobox
                v-model="newBook.status"
                label="Tình Trạng"
                :items="status"
                required


              ></v-combobox>
            </v-col>
          </v-row>

          <!-- Mục chọn hình ảnh -->

          <v-text-field
            v-model="newBook.image"
            label="Nhập URL Hình ảnh*"
            prepend-icon="mdi-image"
            required
          ></v-text-field>

          <!-- Hiển Thị Ảnh Xem Trước -->
          <v-img
            v-if="newBook.image"
            :src="newBook.image"
            max-width="300"
            max-height="300"
            class="mt-3"
          ></v-img>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text="" @click="resetForm">Hủy</v-btn>
        <v-btn color="blue darken-1" text="" @click="submitForm">{{
          isEdit ? 'Cập nhật' : 'Lưu'
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

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
import { computed, onMounted, reactive, ref,   } from 'vue'
import type { IBookCreate, IBooks } from '../../interface/product/product'

// ========Thông báo================
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationColor = ref('')

// Biến arrBooks được định nghĩa là reactive để đảm bảo tính phản ứng
const arrBooks = reactive<IBooks[]>([])


const dialog = ref(false) // Hiện form

// Tạo đối tượng để lưu=================================
const categories = ['Tiểu thuyết', 'Khoa học', 'Lịch sử', 'Tâm lý học', 'Tự nhiên']
// ===============hàm chọn tình trạng sách==================

const selectedStatus = ref('Tất cả') // Giá trị mặc định là "Tất cả"

const status = ['Sách mới', 'Đã mượn', 'Hư hỏng']

// Mảng lưu sách đã lọc theo trạng thái
const filteredBooks = computed(() => {
  // Nếu trạng thái là 'Tất cả' thì trả về toàn bộ danh sách
  if (selectedStatus.value === 'Tất cả') {
    return arrBooks
  }
  // Nếu không, lọc sách theo trạng thái đã chọn
  return arrBooks.filter((book) => book.status === selectedStatus.value)
})
// ===============hàm thêm sách và sửa sách==================
const editBook = (id: number) => {
  const book = arrBooks.find((item) => item.id === id)
  if (book) {
    Object.assign(newBook, book) // Đặt dữ liệu vào form
    isEdit.value = true
    dialog.value = true // Mở form sửa sách
  }
}
const newBook = reactive<IBooks>({
  id: 0,
  nameBook: '',
  nameAuthor: '',
  publicationBook: '',
  category: '',
  status: 'Sách mới',
  image: '',
})
const isEdit = ref(false) // Biến kiểm tra nếu đây là form sửa hay thêm

const submitForm = () => {
  // Kiểm tra nhập dữ liệu
  if (
    !newBook.nameBook.trim() ||
    !newBook.nameAuthor.trim() ||
    !newBook.publicationBook.trim() ||
    !newBook.category.trim() ||
    !newBook.status.trim() ||
    !newBook.image
  ) {
    notificationMessage.value = 'Vui lòng nhập đầy đủ thông tin'
    notificationColor.value = 'red'
    showNotification.value = true // Hiển thị thông báo
    return
  }

  if (isEdit.value) {
    // Nếu là sửa sách, tìm và cập nhật sách
    const index = arrBooks.findIndex((book: IBooks) => book.id === newBook.id)

    if (index !== -1) {
      arrBooks[index] = { ...newBook } // Cập nhật sách
      notificationMessage.value = 'Cập nhật sách thành công'
    }
  } else {
    // Nếu là thêm sách, tạo id mới và thêm vào danh sách
    const newId = arrBooks.length ? Math.max(...arrBooks.map((book) => book.id)) + 1 : 1
    arrBooks.push({ ...newBook, id: newId })
    notificationMessage.value = 'Tạo mới sách thành công'
  }

  // Lưu lại vào localStorage
  localStorage.setItem('books', JSON.stringify(arrBooks))

  // Thông báo thành công
  notificationColor.value = 'green'
  showNotification.value = true // Hiển thị thông báo

  // Reset form và đóng modal
  resetForm()

  console.log("Ngay", newBook.publicationBook);
}

// reset form
const resetForm = () => {
  newBook.nameBook = ''
  newBook.nameAuthor = ''
  newBook.publicationBook = ''
  newBook.category = ''
  newBook.status = ''
  dialog.value = false
  isEdit.value = false
  newBook.image = ''

}

// =============================================

// ===============hàm xóa sách==================
const confirmDeleteDialog = ref(false)
const bookToDeleteId = ref<number | null>(null)

// Hàm mở modal xác nhận xóa
const confirmDelete = (id: number) => {
  bookToDeleteId.value = id // Lưu lại ID của sách cần xóa
  confirmDeleteDialog.value = true // Hiện modal xác nhận xóa
}

// Hàm thực hiện xóa sách
const deleteBook = () => {
  if (bookToDeleteId.value !== null) {
    // Thực hiện xóa sách khỏi danh sách
    arrBooks.splice(
      arrBooks.findIndex((book) => book.id === bookToDeleteId.value),
      1,
    )
    localStorage.setItem('books', JSON.stringify(arrBooks)) // Lưu lại vào localStorage
    notificationMessage.value = 'Xóa thành công'
    notificationColor.value = 'green'
    showNotification.value = true // Hiển thị thông báo
    initializeBooks()
    bookToDeleteId.value = null
    confirmDeleteDialog.value = false
  }
}

const initializeBooks = () => {
  const Books = JSON.parse(localStorage.getItem('books') || '[]')
  if (Books.length) {
    arrBooks.splice(0, arrBooks.length, ...Books) // Cập nhật dữ liệu vào arrBooks
    // splice(start, deleteCount, item1, item2, ...): bắt đầu từ 0, xóa mảng arr, cập nhật lại toàn bộ dữ liệu
  } else {
    // Nếu không có dữ liệu trong localStorage, sử dụng dữ liệu mặc định
    localStorage.setItem('books', JSON.stringify(arrBooks))
  }

  // Lưu lại categories và statuses vào localStorage nếu chưa có
  const Category = JSON.parse(localStorage.getItem('categories') || '[]')
  const Statuses = JSON.parse(localStorage.getItem('statuses') || '[]')
  if (!Category.length || !Statuses.length) {
    localStorage.setItem('categories', JSON.stringify(categories))
    localStorage.setItem('statuses', JSON.stringify(status))
  }
}
onMounted(() => {
  initializeBooks()
})
</script>

<style scoped>
/* CSS cho icon Sửa */
.edit-icon {
  color: #4caf50; /* Màu xanh lá cho icon sửa */
  cursor: pointer;
  transition: color 0.3s ease;
}

.edit-icon:hover {
  color: #388e3c; /* Màu xanh đậm khi hover */
}

/* CSS cho icon Xóa */
.delete-icon {
  color: #f44336; /* Màu đỏ cho icon xóa */
  cursor: pointer;
  transition: color 0.3s ease;
}

.delete-icon:hover {
  color: #d32f2f; /* Màu đỏ đậm khi hover */
}

.mr-2 {
  margin-right: 10px;
}
.full-width {
  max-width: 100%;
}

.custom-snackbar {
  position: fixed !important;
  top: 60px;
  right: 200px;
  bottom: auto !important;
  left: auto !important;
}
</style>
