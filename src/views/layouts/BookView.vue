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

        <!-- Danh sách sách -->
        <div class="book-grid">
          <div v-for="(book, index) in filteredBooks" :key="index" class="book-item">
            <img :src="book.image" :alt="book.title" />
            <h3>
              <router-link :to="'/book-detail/' + book.id">{{ book.title }}</router-link>
            </h3>
            <p>Tác giả: {{ book.author }}</p>
            <button @click="borrowBook(book.title)">Mượn</button>
          </div>
        </div>
      </main>
    </div>

    <!-- Footer -->
    <footer>
      <p>&copy; 2024 Thư viện Online. Tất cả các quyền được bảo lưu.</p>
      <p>Liên hệ: contact@thuvienonline.com</p>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      books: [
        {
          id: 1,
          title: 'Harry Potter và Hòn đá phù thủy',
          author: 'J.K. Rowling',
          image: '/img/Harry Potter va hoa da phu thuy.jpg',
        },
        {
          id: 2,
          title: 'Cuốn theo chiều gió',
          author: 'Margaret Mitchell',
          image: '/img/cuon theo chieu gio.jpg',
        },
        { id: 3, title: 'Đắc Nhân Tâm', author: 'Dale Carnegie', image: '/img/dac nhan tam.jpg' },
        { id: 4, title: 'Nhà giả kim', author: 'Paulo Coelho', image: '/img/nha gia kim.jpg' },
        {
          id: 5,
          title: 'Sapiens: Lược sử loài người',
          author: 'Yuval Noah Harari',
          image: '/img/Sapiens luoc su loai nguoi.png',
        },
        {
          id: 6,
          title: 'Tội ác và trừng phạt',
          author: 'Fyodor Dostoevsky',
          image: '/img/toi ac va trung phat.jpg',
        },
        {
          id: 7,
          title: 'Lược sử thời gian',
          author: 'Stephen Hawking',
          image: '/img/luot su thoi gian.jpg',
        },
        { id: 8, title: 'Bố già', author: 'Mario Puzo', image: '/img/bo gia.jpg' },
        {
          id: 9,
          title: 'Những kẻ xuất chúng',
          author: 'Malcolm Gladwell',
          image: '/img/nhung ke xuat chung.png',
        },
        {
          id: 10,
          title: 'Chiến tranh và hòa bình',
          author: 'Leo Tolstoy',
          image: '/img/chien tranh va hoa binh.jpg',
        },
      ],
    }
  },
  computed: {
    filteredBooks() {
      if (!this.searchQuery) return this.books
      return this.books.filter((book) =>
        book.title.toLowerCase().includes(this.searchQuery.toLowerCase()),
      )
    },
  },
  methods: {
    searchBooks() {
      // Hàm này có thể được dùng để xử lý tìm kiếm, nhưng đã có computed property
      // để lọc danh sách sách khi người dùng nhập vào ô tìm kiếm.
    },
    borrowBook(title) {
      // Lấy dữ liệu sách từ localStorage, hoặc khởi tạo một mảng nếu không có
      let cart = JSON.parse(localStorage.getItem('cart')) || []

      // Thêm cuốn sách vào giỏ hàng
      cart.push({ title })

      // Lưu lại giỏ hàng vào localStorage
      localStorage.setItem('cart', JSON.stringify(cart))

      // Chuyển hướng đến trang giỏ sách
      this.$router.push('/cart')
    },
  },
}
</script>

<style scoped>
/* Reset CSS */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Bố cục chung */
html,
body {
  height: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #2c3e50;
  color: #fff;
}

header .logo h1 {
  font-size: 24px;
}

header nav ul {
  display: flex;
  list-style: none;
}

header nav ul li {
  margin-left: 20px;
}

header nav ul li a {
  color: #fff;
  text-decoration: none;
  font-size: 16px;
}

main {
  padding: 20px;
}

.content {
  flex: 1;
}

footer {
  background-color: #333;
  color: #fff;
  text-align: center;
  padding: 20px 0;
  width: 100%;
}

/* Danh sách sách */
#book-list h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.search-bar {
  display: flex;
  margin-bottom: 20px;
}

.search-bar input[type='text'] {
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
}

.search-bar button {
  padding: 10px 20px;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.book-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.book-item {
  width: 200px; /* Đảm bảo chiều rộng đồng nhất */
  height: 400px; /* Thiết lập chiều cao cố định */
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s;
  box-sizing: border-box;
}

.book-item img {
  width: 100%;
  height: 60%; /* Đặt chiều cao ảnh theo phần trăm để tạo sự nhất quán */
  object-fit: cover; /* Cắt ảnh nếu vượt quá khung */
  border-radius: 8px;
}

.book-item h3 {
  font-size: 1.1em;
  margin: 10px 0;
  color: #333;
  flex-grow: 1;
}

.book-item p {
  font-size: 0.9em;
  color: #555;
  margin-bottom: 10px;
}

.book-item button {
  padding: 8px;
  width: 100%;
  background-color: #27ae60;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.book-item:hover {
  transform: translateY(-5px);
}

/* Đăng Nhập / Đăng Ký */
.login-container {
  width: 300px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
}

.login-container h2 {
  margin-bottom: 20px;
  color: #333;
}

.login-container input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.login-container button {
  padding: 10px;
  width: 100%;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
/* Chi Tiết Sách */
.book-detail {
  display: flex;
  max-width: 800px;
  margin: 50px auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.book-detail img {
  width: 250px;
  height: auto;
}

.book-info {
  padding: 20px;
}

.book-info h2 {
  margin-bottom: 10px;
  color: #333;
}

.book-info p {
  margin: 5px 0;
  color: #666;
}

.book-info button {
  padding: 10px;
  background-color: #27ae60;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
/* Giỏ Sách */
.cart {
  max-width: 600px;
  margin: 20px auto;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  border-bottom: 1px solid #ddd;
}

.cart-item p {
  margin: 0;
  color: #333;
}

.cart-item button {
  padding: 8px;
  background-color: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.checkout {
  display: block;
  padding: 10px;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 20px auto;
}
/* Sách Đã Mượn */
.borrowed-list {
  max-width: 600px;
  margin: 20px auto;
}

.borrowed-item {
  border-bottom: 1px solid #ddd;
  padding: 15px;
}

.borrowed-item p {
  margin: 5px 0;
  color: #333;
}

.borrowed-item button {
  padding: 8px;
  margin: 5px 5px 0 0;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
