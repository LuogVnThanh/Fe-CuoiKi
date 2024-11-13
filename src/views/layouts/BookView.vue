<template>
  <div>
    <!-- Main Content -->
    <div class="content">
      <main>
        <h2>Danh sách sách</h2>

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
          <div v-for="(book, index) in ListBook" :key="index" class="book-item">
            <img :src="book.image" style="height: 100px" />
            <h3 style="height: 100px; align-items: center">
              {{ book.nameBook }}
            </h3>
            <p style="height: 20px">Thể loại: {{ book.category }}</p>
            <p style="height: 50px">Tác giả: {{ book.nameAuthor }}</p>
            <button @click="borrowBook(book.nameBook)">Mượn</button>
          </div>
        </div>
      </main>
    </div>
  </div>

  <!-- Page -->
 
  <div class="text-center">
    <v-pagination
      v-model="page"
      :length="15"
      :total-visible="7"
    ></v-pagination>
  </div>


</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { IBooks } from '../../interface/product/product'

// Khai báo các biến
const searchQuery = ref('')
const router = useRouter()
const page= ref(1)

const ListBook = ref<IBooks[]>([])
const noResults = ref(false) // Trạng thái kiểm tra không có kết quả

// Danh sách sách lấy từ localStorage
const books = JSON.parse(localStorage.getItem('books') || '[]')

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

// Hàm xử lý mượn sách và lưu vào localStorage
const borrowBook = (nameBook: string) => {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]')
  cart.push({ nameBook })
  localStorage.setItem('cart', JSON.stringify(cart))
  router.push('/order')
}

// Lấy danh sách sách từ localStorage khi thành phần được tải
onMounted(() => {
  const storedBooks = JSON.parse(localStorage.getItem('books') || '[]')
  ListBook.value = Array.isArray(storedBooks) ? storedBooks : []
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

/* Lưới sách */
.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

/* Phần tử sách */
.book-item {
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
</style>
