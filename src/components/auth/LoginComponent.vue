<template>
  <!-- backgourd -->
  <div class="auth-background">
    <v-container class="d-flex justify-center align-center" style="height: 100vh">
      <v-sheet class="login-container" width="350" height="auto">
        <v-form ref="form" @keyup.enter="handleLogin">
          <v-text-field
            v-model="initialForm.email"
            label="Email"
            required
            prepend-inner-icon="mdi-account"
            class="custom-input"
            style="width: 300px"
          >
            <!-- Icon người dùng -->
          </v-text-field>

          <v-text-field
            v-model="initialForm.password"
            label="Password"
            required
            style="width: 300px"
            class="custom-input"
            prepend-inner-icon="mdi-lock"
            :type="showPassword ? 'text' : 'password'"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="togglePasswordVisibility"
          >
            <!-- append-icon: thêm icon ngoài inoput
      append-inner-icon: thêm icon vào bên trong và bên phải input -->
            <!-- prepend-inner-icon  thêm vào bên trong và bên trái input -->
          </v-text-field>

          <div class="d-flex flex-column">
            <v-btn class="login-button mt-4" color="success" block @click.prevent="handleLogin">
              Đăng nhập
            </v-btn>
            <!-- <div class="d-flex justify-space-between "> -->
            <div>
              <!-- <p
              class="mt-4 d-flex justify-end cursor-pointer"
              color="info"
              block
              style="font-size: 16px;"
            >
              Quên mật khẩu?
            </p> -->
              <p
                class="mt-4 d-flex justify-end cursor-pointer"
                color="info"
                block
                style="font-size: 16px"
                @click.prevent="handleDirect"
              >
                Chưa có tài khoản?
              </p>
            </div>
          </div>
        </v-form>

        <!-- Snackbar for notifications -->
        <!-- Hiện thông báo -->
      </v-sheet>
    </v-container>
  </div>

  <v-snackbar
    v-model="showNotification"
    :color="notificationColor"
    timeout="3000"
    class="custom-snackbar"
  >
    <!-- <v-icon left v-if="notificationColor === 'green'" color="white">mdi-check-circle</v-icon>
  <v-icon left v-else color="white ">mdi-close-circle</v-icon>
 -->

    {{ notificationMessage }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { ILogin } from '../../interface/auth/auth'
import type { IUser } from '../../interface/user/user'
import type { IOrder } from '@/interface/order/order'

const router = useRouter()

const showNotification = ref(false)
const notificationMessage = ref('')
const notificationColor = ref('')
const showPassword = ref(false)

const arrAccount = reactive<IUser[]>([
  {
    id: 1,
    name: 'Admin',
    email: 'admin@gmail.com',
    password: '123456789',
    role: 'admin',
    currentPage: 1,
  },
  {
    id: 2,
    name: 'Độc Giả',
    email: 'docgia@gmail.com',
    password: '123456789',
    role: 'readers',
    currentPage: 1,
  },
  {
    id: 3,
    name: 'Thủ Thư ',
    email: 'thuthu@gmail.com',
    password: '123456789',
    role: 'librarian',
    currentPage: 1,
  },
])

const arrBooks = reactive([
  {
    id: 1,
    nameBook: 'Harry Potter và Hòn Đá Phù Thủy',
    nameAuthor: 'J.K. Rowling',
    publicationBook: '1997-06-26',
    category: 'Tiểu thuyết',
    status: 'Sách mới',
    image:
      'https://upload.wikimedia.org/wikipedia/vi/5/51/Harry_Potter_v%C3%A0_H%C3%B2n_%C4%91%C3%A1_ph%C3%B9_th%E1%BB%A7y_b%C3%ACa_2003.jpeg',
  },
  {
    id: 2,
    nameBook: 'Sapiens: Lược Sử Loài Người',
    nameAuthor: 'Yuval Noah Harari',
    publicationBook: '2014-09-04',
    category: 'Khoa học',
    status: 'Sách mới',
    image: 'https://th.bing.com/th/id/OIP.Stw79Vr0ngHYYtuP279VaQHaJ-?rs=1&pid=ImgDetMain',
  },
  {
    id: 3,
    nameBook: 'Đắc Nhân Tâm',
    nameAuthor: 'Dale Carnegie',
    publicationBook: '1936-10-10',
    category: 'Tâm lý học',
    status: 'Hư hỏng',
    image: 'https://nhasachmienphi.com/wp-content/uploads/dac-nhan-tam.jpg',
  },
  {
    id: 4,
    nameBook: 'Lược Sử Thời Gian',
    nameAuthor: 'Stephen Hawking',
    publicationBook: '1988-04-01',
    category: 'Khoa học',
    status: 'Sách mới',
    image:
      'https://upload.wikimedia.org/wikipedia/vi/6/6f/L%C6%B0%E1%BB%A3c_s%E1%BB%AD_th%E1%BB%9Di_gian.jpg',
  },
  {
    id: 5,
    nameBook: 'Bố Già',
    nameAuthor: 'Mario Puzo',
    publicationBook: '1969-03-10',
    category: 'Tiểu thuyết',
    status: 'Đã mượn',
    image: 'https://upload.wikimedia.org/wikipedia/vi/f/f4/Godfather-Novel-Cover.png',
  },
  {
    id: 6,
    nameBook: 'Nhà Giả Kim',
    nameAuthor: 'Paulo Coelho',
    publicationBook: '1988-04-15',
    category: 'Tiểu thuyết',
    status: 'Hư hỏng',
    image: 'https://nhasachmienphi.com/images/thumbnail/nhasachmienphi-nha-gia-kim.jpg',
  },
  {
    id: 7,
    nameBook: 'Cuốn Theo Chiều Gió',
    nameAuthor: 'Margaret Mitchell',
    publicationBook: '1936-06-30',
    category: 'Tiểu thuyết',
    status: 'Sách mới',
    image: 'https://upload.wikimedia.org/wikipedia/vi/6/6b/Gone_with_the_Wind_cover.jpg',
  },
  {
    id: 8,
    nameBook: 'Tội Ác Và Trừng Phạt',
    nameAuthor: 'Fyodor Dostoevsky',
    publicationBook: '1866-01-01',
    category: 'Tiểu thuyết',
    status: 'Sách mới',
    image: 'https://upload.wikimedia.org/wikipedia/vi/5/57/Krimo-k-puno_rusa_eldono_2004.jpg',
  },
  {
    id: 9,
    nameBook: 'Chiến Tranh Và Hòa Bình',
    nameAuthor: 'Leo Tolstoy',
    publicationBook: '1869-01-01',
    category: 'Lịch sử',
    status: 'Hư hỏng',
    image:
      'https://www.truyenngan.com.vn/images/linhbp/2014-tieu-thuyet/chien-tranh-va-hoa-binh.gif',
  },
  {
    id: 10,
    nameBook: 'Những Kẻ Xuất Chúng',
    nameAuthor: 'Malcolm Gladwell',
    publicationBook: '2008-11-18',
    category: 'Tâm lý học',
    status: 'Sách mới',
    image: 'https://thuviensach.vn/img/news/2022/09/larger/779-nhung-ke-xuat-chung-1.jpg?v=8032',
  },
  {
    id: 11,
    nameBook: 'Suối Nguồn',
    nameAuthor: 'Ayn Rand',
    publicationBook: '1943-05-07',
    category: 'Tiểu thuyết',
    status: 'Sách mới',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/6/6e/The_Fountain_Head_%281943_1st_ed%29_-_Ayn_Rand.jpg',
  },
  {
    id: 12,
    nameBook: 'Lịch Sử Thế Giới',
    nameAuthor: 'H.G. Wells',
    publicationBook: '1920-01-01',
    category: 'Lịch sử',
    status: 'Hư hỏng',
    image:
      'https://thuviensach.vn/img/news/2022/11/larger/8757-chien-tranh-giua-cac-the-gioi-1.jpg',
  },
  {
    id: 13,
    nameBook: 'Cách Phá Hoại Một Bộ Rom-Com',
    nameAuthor: ' 송아송아',
    publicationBook: '2023-11-14',
    category: 'Romance ',
    status: 'Sách mới',
    image: 'https://i.hako.vn/ln/series/covers/s19382-9fe0a4ac-6fc6-4a65-9a46-141fedbce458.jpg',
  },
  {
    id: 14,
    nameBook: '300 Bài Code Thiếu Nhi',
    nameAuthor: 'Tủ sách 4.0',
    publicationBook: '2023-6-20',
    category: 'Thiếu nhi ',
    status: 'Sách mới',
    image:
      'https://st.quantrimang.com/photos/image/2020/11/06/cuon-sach-300-bai-code-thieu-nhi-va-nhung-mau-chuyen-vui-cua-anh-em-coder.jpg',
  },

  {
    id: 15,
    nameBook: 'Vật Lý Đại Cương Tập Một',
    nameAuthor: 'Lương Duyên Bình',
    publicationBook: '2020-11-30',
    category: 'Vật lý ',
    status: 'Sách mới',
    image:
      'https://tailieuvnu.com/wp-content/uploads/2020/11/30/Giao-trinh-Vat-ly-dai-cuong-tap-1-Luong-Duyen-Binh.png',
  },

  {
    id: 16,
    nameBook: 'Ngày mai Vô tận',
    nameAuthor: ' Nub.đi.viết.truyện',
    publicationBook: '2021-1-20',
    category: 'Truyện chữ ',
    status: 'Sách mới',
    image: 'https://i.hako.vn/ln/series/covers/s19851-35c1ceab-058a-4827-891f-e223b7a9a9f0.jpg',
  },
  {
    id: 17,
    nameBook: 'Summer',
    nameAuthor: 'foxxytail',
    publicationBook: '2021-1-20',
    category: 'Truyện chữ ',
    status: 'Sách mới',
    image: 'https://i.hako.vn/ln/series/covers/s19843-ce2ec96f-dabb-4695-96ff-bc2dd528a7c3.jpg',
  },
  {
    id: 18,
    nameBook: 'Ai mà biết chúng nó nghiện Game Online!',
    nameAuthor: 'Ngân Hà',
    publicationBook: '2019-1-20',
    category: 'Truyện chữ ',
    status: 'Sách mới',
    image: 'https://i.hako.vn/ln/series/covers/s19760-7b402696-8a5f-4b57-bfbb-0e127fa87257.jpg',
  },
  {
    id: 19,
    nameBook: 'Cuộc Chơi Của Sự Thật và Dối Trá',
    nameAuthor: 'Hoa Dấu Tên',
    publicationBook: '2019-1-20',
    category: 'Truyện chữ ',
    status: 'Sách mới',
    image: 'https://i.hako.vn/ln/series/covers/s19773-68380ae1-0486-4a8c-9a7b-634c74b314c4.jpg',
  },
  {
    id: 20,
    nameBook: 'Another life, same friend',
    nameAuthor: 'Alice',
    publicationBook: '2019-1-20',
    category: 'Truyện chữ ',
    status: 'Sách mới',
    image: 'https://i.hako.vn/ln/series/covers/s19805-479efe36-c44c-43ba-973a-aeccd0089b81.jpg',
  },
])

const arrOrders = reactive<IOrder[]>([
  {
    idBook: 2,
    nameBook: 'Sapiens: Lược Sử Loài Người',
    idUser: 3,
    nameUser: 'Thủ thư 1',
    action: 'Quá hạn',
    borrowedDate: '2023-12-4',
    paymentDate: '2023-12-12',
    image: 'https://th.bing.com/th/id/OIP.Stw79Vr0ngHYYtuP279VaQHaJ-?rs=1&pid=ImgDetMain',
  },
  {
    idBook: 1,
    nameBook: 'Harry Potter và Hòn Đá Phù Thủy',
    idUser: 3,
    nameUser: 'Thủ thư 1',
    image:
      'https://upload.wikimedia.org/wikipedia/vi/5/51/Harry_Potter_v%C3%A0_H%C3%B2n_%C4%91%C3%A1_ph%C3%B9_th%E1%BB%A7y_b%C3%ACa_2003.jpeg',
    action: 'Đã trả',
    borrowedDate: '2023-12-10',
    paymentDate: '2023-12-17',
  },
  {
    idBook: 11,
    nameBook: 'Suối Nguồn',
    idUser: 3,
    nameUser: 'Thủ thư 1',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/6/6e/The_Fountain_Head_%281943_1st_ed%29_-_Ayn_Rand.jpg',
    action: 'Đã trả',
    borrowedDate: '2023-12-8',
    paymentDate: '2023-12-15',
  },
  {
    idBook: 2,
    nameBook: 'Sapiens: Lược Sử Loài Người',
    idUser: 3,
    nameUser: 'Thủ thư 1',
    action: 'Quá hạn',
    borrowedDate: '2024-10-4',
    paymentDate: '2024-1-12',
    image: 'https://th.bing.com/th/id/OIP.Stw79Vr0ngHYYtuP279VaQHaJ-?rs=1&pid=ImgDetMain',
  },
  {
    idBook: 5,
    nameBook: 'Bố già',
    idUser: 3,
    nameUser: 'Thủ thư 1',
    action: 'Đã mượn',
    image: 'https://upload.wikimedia.org/wikipedia/vi/f/f4/Godfather-Novel-Cover.png',
    borrowedDate: '2024-11-20',
    paymentDate: '2024-1-8',
  },
  {
    idBook: 8,
    nameBook: 'Tội Ác Và Trừng Phạt',
    idUser: 3,
    nameUser: 'Thủ thư 1',
    action: 'Đã mượn',
    borrowedDate: '2024-1-8',
    paymentDate: '2024-1-15',
    image: 'https://upload.wikimedia.org/wikipedia/vi/5/57/Krimo-k-puno_rusa_eldono_2004.jpg',
  },
  {
    idBook: 11,
    nameBook: 'Suối Nguồn',
    idUser: 3,
    nameUser: 'Thủ thư 1',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/6/6e/The_Fountain_Head_%281943_1st_ed%29_-_Ayn_Rand.jpg',
    action: 'Đã mượn',
    borrowedDate: '2024-1-8',
    paymentDate: '2024-1-15',
  },
  {
    idBook: 1,
    nameBook: 'Harry Potter và Hòn Đá Phù Thủy',
    idUser: 1,
    nameUser: 'Admin',
    image:
      'https://upload.wikimedia.org/wikipedia/vi/5/51/Harry_Potter_v%C3%A0_H%C3%B2n_%C4%91%C3%A1_ph%C3%B9_th%E1%BB%A7y_b%C3%ACa_2003.jpeg',
    action: 'Đã mượn',
    borrowedDate: '2024-1-10',
    paymentDate: '2024-1-17',
  },
  {
    idBook: 1,
    nameBook: 'Harry Potter và Hòn Đá Phù Thủy',
    idUser: 1,
    nameUser: 'Admin',
    image:
      'https://upload.wikimedia.org/wikipedia/vi/5/51/Harry_Potter_v%C3%A0_H%C3%B2n_%C4%91%C3%A1_ph%C3%B9_th%E1%BB%A7y_b%C3%ACa_2003.jpeg',
    action: 'Đã mượn',
    borrowedDate: '2024-1-10',
    paymentDate: '2024-1-17',
  },
])

// Lưu `arrBooks` vào `localStorage`
const updateBooksInLocalStorage = () => {
  localStorage.setItem('books', JSON.stringify(arrBooks))
}
// Khi trang khởi động, nếu localStorage có thông tin user thì đưa user đó vào initialForm
const initializeUsers = () => {
  const Users = JSON.parse(localStorage.getItem('users') || '[]')
  const Books = JSON.parse(localStorage.getItem('books') || '[]')
  const Orders = JSON.parse(localStorage.getItem('orders') || '[]')
  if (!Users.length) {
    localStorage.setItem('users', JSON.stringify(arrAccount))
  }
  if (!Orders.length) {
    localStorage.setItem('orders', JSON.stringify(arrOrders))
  }
  if (Books.length) {
    arrBooks.splice(0, arrBooks.length, ...Books) // Cập nhật `arrBooks`
  } else {
    updateBooksInLocalStorage()
  }
}

// Mỗi khi `arrBooks` thay đổi, cập nhật vào `localStorage`
watch(arrBooks, updateBooksInLocalStorage, { deep: true })

// Tạo đối tượng để lưu dữ liệu khi người dùng nhập vào
const initialForm = reactive<ILogin>({
  email: 'admin@gmail.com',
  password: '123456789',
})

const handleDirect = () => {
  router.push('/register')
}

const handleLogin = () => {
    // Kiểm tra định dạng email hợp lệ
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailPattern.test(initialForm.email)) {
      notificationMessage.value = 'Email không hợp lệ.'
      notificationColor.value = 'red'
      showNotification.value = true
      return
    }
    // Kiểm tra độ dài mật khẩu
    if (initialForm.password.length < 8) {
      notificationMessage.value = 'Mật khẩu phải có ít nhất 8 ký tự.'
      notificationColor.value = 'red'
      showNotification.value = true
      return
    }

    // lấy danh sách ngươi dùng

    const users = JSON.parse(localStorage.getItem('users') || '[]') as IUser[]
    const user = users.find(
      (account) => account.email === initialForm.email && account.password === initialForm.password,
    )

    // Nếu người dùng tồn tại
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))

      notificationMessage.value = `Đăng nhập thành công tài khoản: ${user.email}`
      notificationColor.value = 'green'

      checkOrCreateOrder(user.id)

      // Dùng setTimeout để trì hoãn việc chuyển hướng sang trang home
      // Kiểm tra vai trò người dùng và chuyển hướng
      if (user.role === 'admin') {
        // Chuyển hướng tới trang Dashboard nếu là admin
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      } else {
        // Chuyển hướng tới trang Home nếu là user
        setTimeout(() => {
          router.push('/home')
        }, 1000)
      }
    } else {
      notificationMessage.value = 'Tài khoản hoặc mật khẩu không đúng.'
      notificationColor.value = 'red'
    }
    showNotification.value = true
  },
  checkOrCreateOrder = (id: number) => {
    //Tìm order của user hiện tại
    const userOrders = arrOrders.filter((order) => order.idUser === id)
    if (userOrders.length > 0) {
      //Lưu order vào local nếu tồn tại
      localStorage.setItem('order', JSON.stringify(userOrders))
      // console.log("Order tồn tại:", userOrders);
    } else {
      // Lưu order mới vào localStorage
      localStorage.setItem('order', JSON.stringify([]))
    }
  }

// Chuyển đổi trạng thái hiện thị mật khẩu
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// Sử dụng onMounted để gọi initializeUsers khi ứng dụng khởi động
onMounted(() => {
  initializeUsers()
})
</script>

<style scoped>
.login-container {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Đổ bóng */
  padding: 30px;
  border-radius: 8px; /* Bo góc */
  background-color: #fff;
}

.custom-input {
  margin-bottom: 20px;
}

.login-button {
  background-color: #1976d2 !important;

  color: #fff;
  font-weight: bold;
  transition: background-color 0.3s ease !important;
  padding-top: 25px !important; /* Thêm khoảng cách trên */
  padding-bottom: 25px !important; /* Thêm khoảng cách dưới */
}

.login-button:hover {
  background-color: #1565c0 !important ;
}

.custom-snackbar {
  position: fixed !important;
  top: 60px;
  right: 200px;
  bottom: auto !important;
  left: auto !important;
}

.auth-background {
  background: url('https://cloud.squidex.io/api/assets/edubao/8d75d9b9-c857-43a5-a3d3-866551137ab5/edubao-6102-body1.jpg')
    no-repeat center center fixed;
  background-size: cover;
  width: 100vw;
  height: 100vh;
}
</style>
