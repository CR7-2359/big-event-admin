<script setup>
import { Delete, Edit } from '@element-plus/icons-vue'
import ChannelSelect  from '@/views/article/components/ChannelSelect.vue'
import ChannelDrawer  from '@/views/article/components/ChannelDrawer.vue'
import {artGetListService} from '@/api/article'

import { ref } from 'vue'
import { formatDate } from '@/utils/format'

const articleList = ref([])
const total = ref(0)
const isLoading = ref(false)

const drawer = ref()
//新增文章
const addClassify = ()=>{
  drawer.value.open({})
}
//删除文章
const onDelete = ()=>{

}
//编辑文章
const onEdit = (row)=>{
  drawer.value.open(row)
}

const params = ref({
  pagenum: 1,
  pagesize: 5,
  cate_id: '',
  state: ''
})

const getList = async ()=>{
  isLoading.value = true
  try{
    const res = await artGetListService(params.value)
    articleList.value = res.data.data
    total.value = res.data.total
    isLoading.value = false
  }catch{
    isLoading.value = false
    return
  }
}

//分页器条数变化
const onSizeChange = (size)=>{
  params.value.pagenum = 1
  params.value.pagesize = size

  //重新发送请求获取列表数据
  getList()
}
//分页器页数变化
const onCurrentChange = (pagenum)=>{
  params.value.pagenum = pagenum

  //重新发送请求获取列表数据
  getList()
}

//
const onSuccess = (type)=>{
  if(type === 'add'){
    params.value.pagenum =  Math.ceil((total.value + 1) / params.value.pagesize)
  }
  getList()

}
</script>

<template>
  <page-container title="文章管理">
    <template #exbtn>
      <el-button type="primary" @click="addClassify">发布文章</el-button>
    </template>
    <!-- 表头区域 -->
    <el-form inline>
      <el-form-item label="文章分类" style="width: 200px">
        <ChannelSelect v-model="params.cate_id"></ChannelSelect>
      </el-form-item >
      <el-form-item label="文章状态" style="width: 200px" >
        <el-select v-model="params.state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">搜索</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表头区域 -->
    <!-- 主体区域 -->
    <el-table  v-loading="isLoading" :data="articleList" style="width: 100%">
      <el-table-column  label="文章标题">
        <template #default="{row}">
          <el-link type="primary" underline="never">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="cate_name" label="分类"></el-table-column>
      <el-table-column prop="pub_date" label="发布时间" >
        <template #default="{row}">
          {{ formatDate(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态" ></el-table-column>
      <el-table-column label="操作" #default="scope" >
        <el-button type="primary" :icon="Edit" circle plain @click="onEdit(scope.row)"></el-button>
        <el-button type="danger" :icon="Delete" plain circle @click="onDelete(scope.row)"></el-button>
      </el-table-column>
    </el-table>
    <!-- 主体区域  -->
    <!-- 抽屉 -->
    <ChannelDrawer ref="drawer" @success="onSuccess"></ChannelDrawer>
    <!-- 分页器 -->
    <el-pagination
    style="margin-top: 20px; justify-content: flex-end;"
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2,3,5,10]"
      :background=true
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
    />
  </page-container>
</template>

<style>

</style>
