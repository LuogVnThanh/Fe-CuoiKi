<template>
<v-container class="d-flex justify-center align-center" style="height: 100vh;">
  <v-sheet
    class="login-container "
    width="350"
    height="auto"
  >
    <v-form ref="form">
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
        <p class="mt-4 d-flex justify-end   cursor-pointer" color="info" block @click.prevent="handleDirect">
          Chưa có tài khoản?
        </p>
      </div>
    </v-form>

    <!-- Snackbar for notifications -->
    <!-- Hiện thông báo -->
  </v-sheet>
</v-container>
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
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { ILogin } from '../../interface/auth/auth'

const router = useRouter()

const showNotification = ref(false)
const notificationMessage = ref('')
const notificationColor = ref('')
const showPassword = ref(false)

const arrAccount = reactive<ILogin[]>([
  {
    email: 'admin@gmail.com',
    password: '1',
    role: 'admin',
  },
  {
    email: 'user@gmail.com',
    password: '1',
    role: 'user',
  },
])

// Tạo đối tượng để lưu dữ liệu khi người dùng nhập vào
const initialForm = reactive({
  email: '',
  password: '',
})

const handleDirect = () => {
  router.push('/register')
}

const handleLogin = () => {
  // tìm xem  thông tin name,password của người dùng nhập vào có giống với thông tin trong arrayAccount không?
  const user = arrAccount.find(
    (account) => account.email === initialForm.email && account.password === initialForm.password,
  )
  // Nếu có

  if (user) {
    localStorage.setItem('user', JSON.stringify(user))
    
    notificationMessage.value = `Đăng nhập thành công tài khoản: ${user.email}`
    notificationColor.value = 'green'

    // Dùng setTimeout để trì hoãn việc chuyển hướng sang trang home
    setTimeout(() => {
      router.push('/home')
    }, 1000) // Trì hoãn 2 giây (hoặc có thể thay đổi thời gian tùy theo ý muốn)
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
</script>

<style scoped>
.login-container {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Đổ bóng */
  padding: 20px;
  border-radius: 8px; /* Bo góc */
  background-color: #fff;

}

.custom-input {
  margin-bottom: 20px;
}

.login-button {
  background-color: #1976d2!important;
   
  color: #fff ;
  font-weight: bold ;
  transition: background-color 0.3s ease !important;
  padding-top: 25px !important; /* Thêm khoảng cách trên */
  padding-bottom : 25px !important; /* Thêm khoảng cách dưới */
}

.login-button:hover {
  background-color: #1565c0 !important ;
}

.custom-snackbar {
  position: fixed !important;
  top: 50px;
  right: 170px;
  bottom: auto !important;
  left: auto !important;
}
</style>
