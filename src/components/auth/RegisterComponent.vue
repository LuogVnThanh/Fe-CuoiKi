<template>
  <v-container class="d-flex justify-center align-center" style="height: 100vh">
    <v-sheet class="register-container" width="350" height="auto">
      <v-form ref="form">
        <!-- input tài khoản -->
        <v-text-field
          v-model="initialForm.email"
          type="email"
          label="Email"
          required
          prepend-inner-icon="mdi-account"
          class="custom-input"
          style="width: 300px"
        >
          <!-- Icon người dùng -->
        </v-text-field>

        <!-- input mật khẩu -->
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

        <!-- input nhập lại mật khẩu -->
        <v-text-field
          v-model="initialForm.confirmPassword"
          label="ConfirmPassword"
          required
          style="width: 300px"
          class="custom-input"
          prepend-inner-icon="mdi-lock"
          :type="showConfirmPassword ? 'text' : 'password'"
          :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="toggleConfirmPasswordVisibility"
        >
          <!-- append-icon: thêm icon ngoài inoput
          append-inner-icon: thêm icon vào bên trong và bên phải input -->
          <!-- prepend-inner-icon  thêm vào bên trong và bên trái input -->
        </v-text-field>

        <div class="d-flex flex-column">
          <v-btn class="register-button mt-4" color="success" block @click.prevent="handleRegister">
            Đăng ký
          </v-btn>
          <p
            class="mt-4 d-flex justify-end cursor-pointer"
            color="info"
            block
            @click.prevent="handleDirect"
          >
            Đã có tài khoản?
          </p>
        </div>
      </v-form>

      <!-- Snackbar để hiện thị thông báo -->
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
import type { ILogin, IRegister } from '../../interface/auth/auth'

const router = useRouter()

const showNotification = ref(false)
const notificationMessage = ref('')
const notificationColor = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
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
const initialForm = reactive<IRegister>({
  email: '',
  password: '',
  confirmPassword: '',
})

const handleDirect = () => {
  router.push('/login')
}

const handleRegister = () => {
  // Kiểm tra xem có ô input nào trống không
  if (!initialForm.email || !initialForm.password || !initialForm.confirmPassword) {
    notificationMessage.value = 'Vui lòng điền đầy đủ tất cả các trường.'
    notificationColor.value = 'red'
    showNotification.value = true
    return
  }
  // Kiểm tra định dạng email hợp lệ
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailPattern.test(initialForm.email)) {
    notificationMessage.value = 'Email không hợp lệ.'
    notificationColor.value = 'red'
    showNotification.value = true
    return
  }

  // Kiểm tra xem email đã tồn tại trong arrAccount chưa
  const userExists = arrAccount.find((account) => account.email === initialForm.email)

  if (userExists) {
    // Nếu email đã tồn tại
    notificationMessage.value = 'Email đã tồn tại'
    notificationColor.value = 'red'
  } else if (initialForm.password.trim() !== initialForm.confirmPassword.trim()) {
    // Kiểm tra mật khẩu
    notificationMessage.value = 'Mật khẩu không trùng khớp.'
    notificationColor.value = 'red'
  } else if (initialForm.password.length < 8) {
    // Kiểm tra độ dài mật khẩu
    notificationMessage.value = 'Mật khẩu không được dưới 8 kí tự.'
    notificationColor.value = 'red'
  } else {
    // Nếu tất cả điều kiện hợp lệ
    const newUser = {
      email: initialForm.email,
      password: initialForm.password,
      role: 'user', // Hoặc có thể lấy role từ nơi khác
    }

    // Lưu tài khoản mới vào localStorage
    localStorage.setItem('user', JSON.stringify(newUser))

    notificationMessage.value = 'Tạo tài khoản thành công.'
    notificationColor.value = 'green'
       // Dùng setTimeout để trì hoãn việc chuyển hướng sang trang home
       setTimeout(() => {
      router.push('/home')
    }, 1000) // Trì hoãn 2 giây (hoặc có thể thay đổi thời gian tùy theo ý muốn)
  }
  showNotification.value = true
}

// Chuyển đổi trạng thái hiện thị mật khẩu
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
// Chuyển đổi trạng thái hiện thị mật khẩu
const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}
</script>

<style scoped>
.register-container {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Đổ bóng */
  padding: 20px;
  border-radius: 8px; /* Bo góc */
  background-color: #fff;
}

.custom-input {
  margin-bottom: 20px;
}

.register-button {
  background-color: #09b823 !important;

  color: #fff;
  font-weight: bold;
  transition: background-color 0.3s ease !important;
  padding-top: 25px !important; /* Thêm khoảng cách trên */
  padding-bottom: 25px !important; /* Thêm khoảng cách dưới */
}

.register-button:hover {
  background-color: #07861a !important ;
}

.custom-snackbar {
  position: fixed !important;
  top: 50px;
  right: 170px;
  bottom: auto !important;
  left: auto !important;
}
</style>
