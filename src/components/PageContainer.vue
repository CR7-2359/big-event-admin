<script setup>
import {defineProps} from 'vue'
defineProps({
  title: {
    required: true,
    type: String
  }
})
</script>

<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="header">
          <span>{{ title }}</span>
          <slot name="exbtn"></slot>
        </div>
      </template>
      <slot></slot>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.page-container{
  box-sizing: border-box;
  .header{
    display:flex;
    justify-content: space-between;
    align-items:center ;
  }
}
</style>
