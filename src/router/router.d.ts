import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAdmin?: boolean;
    allowedRoles?: string[]; // Định nghĩa allowedRoles là một mảng chuỗi
  }
}
