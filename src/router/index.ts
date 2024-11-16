import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/user/HomeView.vue'
import LoginView from '../components/auth/LoginComponent.vue'
import RegisterView from '../components/auth/RegisterComponent.vue'
import Dashboard from '../views/admin/DashBoardView.vue'
import ManagerBook from '../views/admin/ManagerBookView.vue'
import BorrowBook from '../views/admin/BorrowBookView.vue'
import StatisticalBook from '../views/admin/StatisticalBookView.vue'
import OrderView from '../views/layouts/OrderView.vue'
import BookView from '../views/layouts/BookView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('@/views/error/ErrorView.vue'),
      meta: {
        requiresAuth: false,
      },
    },
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
      path: '/order',
      name: 'Order',
      component: OrderView,
    },
    {
      path: '/bookView',
      name: 'BookView',
      component: BookView,
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
      meta: {
        allowedRoles: ['admin', 'librarian'], // Chỉ admin và librarian được phép
      },
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
  const user = JSON.parse(localStorage.getItem('user') || 'null'); // Lấy thông tin người dùng từ localStorage

  // Nếu route yêu cầu quyền truy cập đặc biệt
  if (to.meta.requiresAdmin && (!user || user.role !== 'admin')) {
    next('/login'); // Chuyển về login nếu không phải admin
  } else if (to.meta.allowedRoles) {
    // Nếu route yêu cầu danh sách các roles được phép truy cập
    if (!user || !to.meta.allowedRoles.includes(user.role)) {
      next('/login'); // Chuyển về login nếu role không hợp lệ
    } else {
      next(); // Cho phép tiếp tục nếu role hợp lệ
    }
  } else {
    next(); // Cho phép tiếp tục cho các route không yêu cầu quyền
  }
});
export default router
