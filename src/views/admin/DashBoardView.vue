<template>
    <div class="d-flex justify-space-between">
        <h1>Danh sách sản phẩm</h1>
        <button>Thêm sản phẩm</button>
    </div>
  <v-table height="500px">
    <thead>
      <tr>
        <th class="text-left">Id</th>
        <th class="text-left">Tên sách</th>
        <th class="text-left">Tên tác giả</th>
        <th class="text-left">Ngày xuất bản</th>
        <th class="text-left">Tên loại</th>
        <th class="text-left">Hành động</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in arrBooks" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.nameBook }}</td>
        <td>{{ item.nameAuthor }}</td>
        <td>{{ item.publicationBook }}</td>
        <td>{{ item.category.nameCategory }}</td>
        <td>
            
        </td>

      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { IProduct } from '../../interface/product/product'

const arrBooks = reactive<IProduct[]>([
  {
    id: 1,
    nameBook: 'Book1',
    nameAuthor: 'Author1',
    publicationBook: '2018',
    category: {
      id: 1,
      nameCategory: 'Tiểu thuyết',
    },
  },
  {
    id: 2,
    nameBook: 'Book2',
    nameAuthor: 'Author2',
    publicationBook: '2019',
    category: {
      id: 2,
      nameCategory: 'Khoa học',
    },
  },
  {
    id: 3,
    nameBook: 'Book3',
    nameAuthor: 'Author3',
    publicationBook: '2020',
    category: {
      id: 1,
      nameCategory: 'Tiểu thuyết',
    },
  },
  {
    id: 4,
    nameBook: 'Book4',
    nameAuthor: 'Author4',
    publicationBook: '2015',
    category: {
      id: 3,
      nameCategory: 'Lịch sử',
    },
  },
  {
    id: 5,
    nameBook: 'Book5',
    nameAuthor: 'Author5',
    publicationBook: '2021',
    category: {
      id: 4,
      nameCategory: 'Tâm lý học',
    },
  },
  {
    id: 6,
    nameBook: 'Book6',
    nameAuthor: 'Author6',
    publicationBook: '2017',
    category: {
      id: 5,
      nameCategory: 'Tự nhiên',
    },
  },
  {
    id: 7,
    nameBook: 'Book7',
    nameAuthor: 'Author7',
    publicationBook: '2016',
    category: {
      id: 2,
      nameCategory: 'Khoa học',
    },
  },
  {
    id: 8,
    nameBook: 'Book8',
    nameAuthor: 'Author8',
    publicationBook: '2014',
    category: {
      id: 1,
      nameCategory: 'Tiểu thuyết',
    },
  },
  {
    id: 9,
    nameBook: 'Book9',
    nameAuthor: 'Author9',
    publicationBook: '2013',
    category: {
      id: 3,
      nameCategory: 'Lịch sử',
    },
  },
  {
    id: 10,
    nameBook: 'Book10',
    nameAuthor: 'Author10',
    publicationBook: '2012',
    category: {
      id: 4,
      nameCategory: 'Tâm lý học',
    },
  },
  {
    id: 11,
    nameBook: 'Book11',
    nameAuthor: 'Author11',
    publicationBook: '2022',
    category: {
      id: 1,
      nameCategory: 'Tiểu thuyết',
    },
  },
  {
    id: 12,
    nameBook: 'Book12',
    nameAuthor: 'Author12',
    publicationBook: '2011',
    category: {
      id: 5,
      nameCategory: 'Tự nhiên',
    },
  },
  {
    id: 13,
    nameBook: 'Book13',
    nameAuthor: 'Author13',
    publicationBook: '2020',
    category: {
      id: 3,
      nameCategory: 'Lịch sử',
    },
  },
  {
    id: 14,
    nameBook: 'Book14',
    nameAuthor: 'Author14',
    publicationBook: '2018',
    category: {
      id: 2,
      nameCategory: 'Khoa học',
    },
  },
  {
    id: 15,
    nameBook: 'Book15',
    nameAuthor: 'Author15',
    publicationBook: '2016',
    category: {
      id: 1,
      nameCategory: 'Tiểu thuyết',
    },
  },
  {
    id: 16,
    nameBook: 'Book16',
    nameAuthor: 'Author16',
    publicationBook: '2015',
    category: {
      id: 4,
      nameCategory: 'Tâm lý học',
    },
  },
  {
    id: 17,
    nameBook: 'Book17',
    nameAuthor: 'Author17',
    publicationBook: '2019',
    category: {
      id: 2,
      nameCategory: 'Khoa học',
    },
  },
  {
    id: 18,
    nameBook: 'Book18',
    nameAuthor: 'Author18',
    publicationBook: '2021',
    category: {
      id: 5,
      nameCategory: 'Tự nhiên',
    },
  },
  {
    id: 19,
    nameBook: 'Book19',
    nameAuthor: 'Author19',
    publicationBook: '2022',
    category: {
      id: 3,
      nameCategory: 'Lịch sử',
    },
  },
  {
    id: 20,
    nameBook: 'Book20',
    nameAuthor: 'Author20',
    publicationBook: '2023',
    category: {
      id: 1,
      nameCategory: 'Tiểu thuyết',
    },
  },
])
</script>
