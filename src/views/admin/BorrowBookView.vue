<template>
  <div class="container">
    <div class="header-br">
      <h2>Thông tin mượn trả sách</h2>
      <button class="btn-new">+ Thêm mới</button>
      <!-- thêm mới ở đây -->
    </div>
    <table class="Borrow__table-list">
      <tr class="Borrow__table-header">
        <td>Số thứ tự</td>
        <td>Tên sách</td>
        <td>Tác giả</td>
        <td>Người mượn</td>
        <td>Ngày mượn</td>
        <td>Ngày trả</td>
        <td>Ghi chú</td>
      </tr>
      <tr class="Borrow__table-header">
        <td>1</td>
        <td>Main lỏ và dàn harem cực múp</td>
        <td>wibu</td>
        <td>Huy</td>
        <td>2024-6-3</td>
        <td>2024-6-15</td>
        <td>Khách hàng làm lủng sách</td>
      </tr>
      <tr class="Borrow__table-header">
        <td>2</td>
        <td>Main lỏ và dàn harem cực múp</td>
        <td>wibu</td>
        <td>Huy</td>
        <td>2024-6-3</td>
        <td>2024-6-15</td>
        <td>Khách hàng làm lủng sách</td>
      </tr>
      <tr class="Borrow__table-header">
        <td>3</td>
        <td>Main lỏ và dàn harem cực múp</td>
        <td>wibu</td>
        <td>Huy</td>
        <td>2024-6-3</td>
        <td>2024-6-15</td>
        <td>Khách hàng làm lủng sách</td>
      </tr>
      <tr class="Borrow__table-header">
        <td>4</td>
        <td>Main lỏ và dàn harem cực múp</td>
        <td>wibu</td>
        <td>Huy</td>
        <td>2024-6-3</td>
        <td>2024-6-15</td>
        <td>Khách hàng làm lủng sách</td>
      </tr>
      <tr class="Borrow__table-header">
        <td>5</td>
        <td>Main lỏ và dàn harem cực múp</td>
        <td>wibu</td>
        <td>Huy</td>
        <td>2024-6-3</td>
        <td>2024-6-15</td>
        <td>Khách hàng làm lủng sách</td>
      </tr>
      <tr class="Borrow__table-header">
        <td>6</td>
        <td>Main lỏ và dàn harem cực múp</td>
        <td>wibu</td>
        <td>Huy</td>
        <td>2024-6-3</td>
        <td>2024-6-15</td>
        <td>Khách hàng làm lủng sách</td>
      </tr>
      <tr class="Borrow__table-header">
        <td>7</td>
        <td>Main lỏ và dàn harem cực múp</td>
        <td>wibu</td>
        <td>Huy</td>
        <td>2024-6-3</td>
        <td>2024-6-15</td>
        <td>Khách hàng làm lủng sách</td>
      </tr>
    </table>
  </div>
</template>
<style scoped>
.container {
  background-color: #f5f5f5;
  padding: 30px;
  border-radius: 10px;
}
.header-br {
  display: flex;
  justify-content: space-between;
}
.btn-new {
  background-color: #50ad54;
  color: white;
  padding: 12px;
  border-radius: 5px;
  transition: 200ms;
}
.btn-new:hover {
  box-shadow: 2px 2px 10px 5px rgba(128, 193, 31, 0.299);
}
.Borrow__table-list {
  width: 100%;
  border-collapse: collapse;
  user-select: none;
}

.Borrow__table-list tr {
  border-bottom: 1px solid #ccc;
}

.Borrow__table-list tr:last-child {
  border-bottom: none;
}

.Borrow__table-list td {
  padding: 10px 10px;
}
</style>

<script setup lang="ts"></script>
