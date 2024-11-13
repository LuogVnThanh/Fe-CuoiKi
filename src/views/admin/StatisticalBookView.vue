<template>
    <div class="container">
      <h2>BẢNG THỐNG KÊ</h2>
      <div class="thong-ke">
        <!-- trái -->
        <div class="thong-ke__pr">
          <!-- 1 -->
            <div class="thong-ke__list bg__section">
              <div class="thong-ke__soluong">
                <h2 class="thong-ke__dem">2519{{}}</h2>
                <img src="" alt="" />
              </div>
              <p class="thong-ke__content">Số người thăm thư viện</p>
            </div>
          <!-- 2 -->
          <div class="thong-ke__list bg__section">
            <div class="thong-ke__soluong">
              <h2 class="thong-ke__dem">33.17%{{}}</h2>
              <img src="" alt="" />
            </div>
            <p class="thong-ke__content">Sách mượn</p>
          </div>
          <!-- 3 -->
          <div class="thong-ke__list bg__section">
            <div class="thong-ke__soluong">
              <h2 class="thong-ke__dem">324{{}}</h2>
              <img src="" alt="" />
            </div>
            <p class="thong-ke__content">Sách quá hạn</p>
          </div>
        </div>
        <!-- giữa... Khách vip -->
        <div class="KhachVip">
          <div class="khachvip-pd">
            <h3 class="khachvip-year">TOP THƯỢNG ĐẾ NĂM : 2024</h3>
          </div>
        </div>
        <!-- phải....Top sách yêu thích -->
        <div class="sachyeuthich">
          <div class="sachyeuthich-pd">
            <div class="sachyeuthichtheo">
              <h3>TOP SÁCH YÊU THÍCH</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script setup lang="ts"></script>
  
  <style scoped>
  /* thuộc tính chung */
  .bg__section {
    background-color: #f5f5f5;
  }
  
  /* -----------------thống kê trái-------------------- */
  .thong-ke__pr {
    width: 17%;
    display: flex;
    flex-direction: column;
    row-gap: 25px;
  }
  .thong-ke__list {
    padding: 12%;
    border-radius: 15px;
    transition: 0.3s;
    user-select: none;
    cursor: pointer;
  }
  .thong-ke__list:hover {
    box-shadow: 3px 3px 3px 3px rgba(0, 0, 0, 0.15);
  }
  .thong-ke__content {
    font-family: Inter;
    font-size: 14px;
    font-weight: 400;
    color: #411313;
  }
  h2 {
    margin-bottom: 0px;
  }
  /* -----------------thống kê top thượng đế-------------------- */
  .thong-ke {
    display: flex;
    margin-top: 25px;
    column-gap: 25px;
  }
  .KhachVip {
    width: 50%;
    background: #f5f5f5;
    border-radius: 15px;
  }
  .khachvip-pd {
    padding: 20px;
  }
  
  /* -----------------Sách yêu thích------------------- */
  .sachyeuthich {
    background-color: #f5f5f5;
    width: 33%;
    border-radius: 15px;
  }
  .sachyeuthich-pd {
    padding: 20px;
  }
  .sachyeuthichtheo {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .sachyeuthich-sl {
    text-align: center;
    padding: 5px 9px;
    background-color: #1868c1;
    color: white;
    border-radius: 5px;
    transition: 0.3s;
  }
  .sachyeuthich-sl:hover {
    box-shadow: 3px 3px 3px 3px rgba(0, 0, 0, 0.2);
  }
  </style>
  <!-- Báo cáo và thống kê: Cung cấp các báo cáo về số lượng sách, lượt mượn, tỷ lệ trả sách đúng hạn, và
  các thống kê khác. -->
  