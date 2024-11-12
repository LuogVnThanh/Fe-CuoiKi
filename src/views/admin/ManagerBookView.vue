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
          <td>
            <v-icon @click="editBook(item.id)" class="mr-2 edit-icon" icon="mdi-pencil"></v-icon>
            <v-icon @click="deleteBook(item.id)" icon="mdi-delete delete-icon"></v-icon>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>

  <!-- Modal thêm sách -->
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
              <v-text-field v-model="newBook.nameBook" label="Tên Sách" required></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="newBook.nameAuthor"
                label="Tên Tác Giả"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Hàng Ngày Xuất Bản -->
          <v-text-field
            v-model="newBook.publicationBook"
            label="Ngày Xuất Bản"
            required
            type="date"
          ></v-text-field>
          <!-- Hàng Loại Sách và Tình Trạng -->
          <v-row>
            <v-col cols="6">
              <v-combobox
                v-model="newBook.category"
                label="Loại Sách"
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
          <v-row>
            <v-col cols="12" md="6">
              <v-file-input
                v-model="newBook.image"
                label="Chọn Hình Ảnh"
                accept="image/*"
                prepend-icon="mdi-image"
                required
                show-size
              ></v-file-input>
            </v-col>
            <v-col cols="12" md="6">
              <!-- Hiển thị ảnh đã chọn -->
              <v-img v-if="newBook.image" :src="newBook.image" max-width="150px"></v-img>
            </v-col>
          </v-row>
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
import { computed, onMounted, reactive, ref } from 'vue'
import type { IBookCreate, IBooks } from '../../interface/product/product'

// ========Thông báo
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationColor = ref('')
// =============

const arrBooks = reactive([
  {
    id: 1,
    nameBook: 'Book1',
    nameAuthor: 'Author1',
    publicationBook: '2018-01-15',
    category: 'Tiểu thuyết',
    status: 'Sách mới',
    image: null as File | null, // Thêm trường image kiểu File hoặc null
  },
  {
    id: 2,
    nameBook: 'Book2',
    nameAuthor: 'Author2',
    publicationBook: '2019-05-21',
    category: 'Khoa học',
    status: 'Đã mượn',
    image: null as File | null,
  },
  {
    id: 3,
    nameBook: 'Book3',
    nameAuthor: 'Author3',
    publicationBook: '2020-07-11',
    category: 'Tiểu thuyết',
    status: 'Hư hỏng',
    image: null as File | null,
  },
  {
    id: 4,
    nameBook: 'Book4',
    nameAuthor: 'Author4',
    publicationBook: '2015-03-30',
    category: 'Lịch sử',
    status: 'Sách mới',
    image: null as File | null,
  },
  {
    id: 5,
    nameBook: 'Book5',
    nameAuthor: 'Author5',
    publicationBook: '2021-10-18',
    category: 'Tâm lý học',
    status: 'Đã mượn',
    image: null as File | null,
  },
  {
    id: 6,
    nameBook: 'Book6',
    nameAuthor: 'Author6',
    publicationBook: '2017-09-06',
    category: 'Tự nhiên',
    status: 'Hư hỏng',
    image: null as File | null,
  },
  {
    id: 7,
    nameBook: 'Book7',
    nameAuthor: 'Author7',
    publicationBook: '2016-02-23',
    category: 'Khoa học',
    status: 'Sách mới',
    image: null as File | null,
  },
  {
    id: 8,
    nameBook: 'Book8',
    nameAuthor: 'Author8',
    publicationBook: '2014-08-29',
    category: 'Tiểu thuyết',
    status: 'Đã mượn',
    image: null as File | null,
  },
  {
    id: 9,
    nameBook: 'Book9',
    nameAuthor: 'Author9',
    publicationBook: '2013-04-19',
    category: 'Lịch sử',
    status: 'Hư hỏng',
    image: null as File | null,
  },
  {
    id: 10,
    nameBook: 'Book10',
    nameAuthor: 'Author10',
    publicationBook: '2012-11-25',
    category: 'Tâm lý học',
    status: 'Sách mới',
    image: null as File | null,
  },
  {
    id: 11,
    nameBook: 'Book11',
    nameAuthor: 'Author11',
    publicationBook: '2022-06-15',
    category: 'Tiểu thuyết',
    status: 'Đã mượn',
    image: null as File | null,
  },
  {
    id: 12,
    nameBook: 'Book12',
    nameAuthor: 'Author12',
    publicationBook: '2011-12-08',
    category: 'Tự nhiên',
    status: 'Hư hỏng',
    image: null as File | null,
  },
   
])


const dialog = ref(false) // Hiện form

// Tạo đối tượng để lưu
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
  status: '',
  image: null,
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
  newBook.image = null
}

// =============================================

// ===============hàm xóa sách==================
const deleteBook = (id: number) => {
  // Lấy dữ liệu sách từ localStorage
  const arrBooks = JSON.parse(localStorage.getItem('books') || '[]')

  //  tìm sách cần xóa dự vào id
  const index = arrBooks.findIndex((book: { id: number }) => book.id == id)

  // Nếu tìm thấy sách (index >= 0)
  if (index > -1) {
    arrBooks.splice(index, 1) // Xóa sách tại vị trí index
    localStorage.setItem('books', JSON.stringify(arrBooks)) // Lưu lại vào localStorage

    notificationMessage.value = 'Xóa thành công'
    notificationColor.value = 'green'
    showNotification.value = true // Hiển thị thông báo
    initializeBooks()
  }
}

// Xử lý lưu toàn bộ sách vào localStorage=================
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
