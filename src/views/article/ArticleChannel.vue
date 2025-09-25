<script setup>
import { ref } from 'vue'
import { articleChannelService, articleDeletChannelService } from '@/api/article'
import ChannelEdit from '@/views/article/components/ChannelEdit.vue'
import { Edit, Delete } from '@element-plus/icons-vue'

const channelList = ref([])
const isLoading = ref(true)

//获取分类列表
const getChannelList = async () => {
  const res = await articleChannelService()
  isLoading.value = false
  channelList.value = res.data.data
}
getChannelList()

const dialog = ref()

//点击编辑
const handleEdit = (index, row) => {
  dialog.value.open(row)
  // console.log(index, row)
}
//添加分类
const addClassify = () => {
  dialog.value.open({})
}
//点击删除按钮
const handleDelete = async (index, row) => {
  try {
    await ElMessageBox.confirm('确认删除吗?', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
  } catch {
    return
  }
  await articleDeletChannelService(row.id)
  await getChannelList()
  ElMessage({
    message: '删除成功',
    type: 'success',
  })
}

const onSuccess = () => {
  getChannelList()
}
</script>

<template>
  <PageContainer title="文章分类">
    <template #exbtn>
      <el-button type="primary" @click="addClassify">添加分类</el-button>
    </template>

    <el-table
      v-if="channelList.length > 0"
      v-loading="isLoading"
      height="100%"
      :data="channelList"
      style="width: 100%"
    >
      <el-table-column type="index" prop="date" label="序号" width="100px" />
      <el-table-column prop="cate_name" label="分类名称" />
      <el-table-column prop="cate_alias" label="分类别名" />
      <el-table-column label="操作名称" width="100px">
        <template #default="scope">
          <el-button
            type="primary"
            :icon="Edit"
            circle
            @click="handleEdit(scope.$index, scope.row)"
          />
          <el-button
            type="danger"
            :icon="Delete"
            circle
            @click="handleDelete(scope.$index, scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-empty v-else description="description" />
  </PageContainer>
  <!-- 弹窗组件 -->
  <ChannelEdit ref="dialog" @success="onSuccess"></ChannelEdit>
</template>

<style>
</style>
