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
              style="font-size: 16px;"
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
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { ILogin } from '../../interface/auth/auth'
import type { IUser } from '../../interface/user/user'

const router = useRouter()

const showNotification = ref(false)
const notificationMessage = ref('')
const notificationColor = ref('')
const showPassword = ref(false)

const arrAccount = reactive<IUser[]>([
  {
    id: 1,
    name:'admin',
    email: 'admin@gmail.com',
    password: '1',
    role: 'admin',
  },
  {
    id: 2,
    name:'doc gia1',
    email: 'docgia@gmail.com',
    password: '1',
    role: 'readers',
  },
  {
    id: 3,
    name:'thủ thư 1',
    email: 'thuthu@gmail.com',
    password: '1',
    role: 'librarian',
  },
])

// Khi trang khởi động, nếu localStorage có thông tin user thì đưa user đó vào initialForm
const initializeUsers = () => {
  const Users = JSON.parse(localStorage.getItem('users') || '[]')
  if (!Users.length) {
    localStorage.setItem('users', JSON.stringify(arrAccount))
  }
}

// Tạo đối tượng để lưu dữ liệu khi người dùng nhập vào
const initialForm = reactive<ILogin>({
  email: '',
  password: '',
})

const handleDirect = () => {
  router.push('/register')
}

const handleLogin = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]') as IUser[]

  const user = users.find(
    (account) => account.email === initialForm.email && account.password === initialForm.password,
  )
  // Nếu có

  if (user) {
    localStorage.setItem('user', JSON.stringify(user))

    notificationMessage.value = `Đăng nhập thành công tài khoản: ${user.email}`
    notificationColor.value = 'green'

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
