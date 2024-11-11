import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/user/HomeView.vue'
import LoginView from '../components/auth/LoginComponent.vue'
import  RegisterView from '../components/auth/RegisterComponent.vue'
import Dashboard from '../views/admin/DashBoardView.vue'
import ManagerBook from '../views/admin/ManagerBookView.vue'
import BorrowBook from '../views/admin/BorrowBookView.vue'
import StatisticalBook from '../views/admin/StatisticalBookView.vue'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login', // Đặt trang mặc định là /login
    },
    {
      path: '/home',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'Regiser',
      component: RegisterView,
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: { requiresAdmin: true }, // Thêm meta cho admin
    },
    {
      path: '/managerbook',
      name: 'ManagerBook',
      component: ManagerBook,
      meta: { requiresAdmin: true }, // Thêm meta cho admin
    },
    {
      path: '/borrowbook',
      name: 'BorrowBook',
      component: BorrowBook,
      meta: { requiresAdmin: true }, // Thêm meta cho admin
    },
    {
      path: '/statisticalbook',
      name: 'StatisticalBook',
      component: StatisticalBook,
      meta: { requiresAdmin: true }, // Thêm meta cho admin
    },
  ],
})

// Kiểm tra xem người dùng có đăng nhập không
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user') || '[]')

  // Nếu người dùng chưa đăng nhập và trang yêu cầu đăng nhập (như dashboard)
  if (to.meta.requiresAdmin && (!user || user.role !== 'admin')) {
    // Chuyển hướng về trang login
    next('/login')
  } else {
    next() // Tiếp tục nếu không có vấn đề gì
  }
})


export default router
