<template>
<v-carousel v-model="activeIndex" show-arrows="hover" height="600" >
  <v-carousel-item
  v-for="(item,index) in itemCarousel"
  :key="index"
  :src="item.src"

    cover
  ></v-carousel-item>


</v-carousel>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";

const activeIndex= ref(0);

const itemCarousel = [
  { src: "https://cdn.pixabay.com/photo/2014/10/14/20/14/library-488690_1280.jpg" },
  { src: "https://scontent.fsgn15-1.fna.fbcdn.net/v/t39.30808-6/344557497_729425865545345_3669065907185124987_n.jpg?stp=dst-jpg_s960x960&_nc_cat=105&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=oyhIyo9bZ2kQ7kNvgGERSe8&_nc_zt=23&_nc_ht=scontent.fsgn15-1.fna&_nc_gid=Ab9gJZ11LdVFESsTllFQQQC&oh=00_AYBPJiENcmD1w0F1-vXN8oUcYUz7OJBs3FTaY-LhHGQfJg&oe=673A3007" },
  { src: "https://kenh14cdn.com/thumb_w/660/2018/9/26/hoatran-img8124-15379796122981042473.jpg" },
];


onMounted(()=>{
  setInterval(()=>{
    activeIndex.value= (activeIndex.value+1)% itemCarousel.length
  },3000)
})
</script>
