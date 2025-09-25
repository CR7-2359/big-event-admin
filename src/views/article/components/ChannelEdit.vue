<script setup>
import { ref, defineExpose, defineEmits } from 'vue'
import { articleAddChannelService, articleEditChannelService } from '@/api/article'
const dialogVisible = ref(false)
const emit = defineEmits(['success'])

const open = async (row) => {
  dialogVisible.value = true
  formData.value = { ...row } //表单回显
}

const isEdit = ref()
const clickConfirm = async () => {
  //发送请求
  await form.value.validate()
  isEdit.value = formData.value.id ? true : false
  if (isEdit.value) {
    await articleEditChannelService(formData.value)
    console.log('编辑成功')
    ElMessage({
      message: '编辑成功',
      type: 'success',
    })
  } else {
    await articleAddChannelService(formData.value)
    console.log('成功')
    ElMessage({
      message: '添加成功',
      type: 'success',
    })
  }
  //关闭弹窗
  dialogVisible.value = false
  //子=》夫通信
  emit('success')
}

defineExpose({
  open,
})

//表单-----------------------------
const form = ref()
const formData = ref({
  cate_alias: '',
  cate_name: '',
  id: 0,
})
const rules = ref({
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    {
      pattern: /^.{1,10}$/,
      message: '分类名必须是1-10位的非空字符',
      trigger: 'blur',
    },
  ],
  cate_alias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    {
      pattern: /^[A-Za-z0-9]{1,10}$/,
      message: '分类别名必须是1-10位的数字字母组合',
      trigger: 'blur',
    },
  ],
})
</script>

<template>
  <el-dialog v-model="dialogVisible" :title="formData.id ? '编辑分类' : '添加分类'" width="600">
    <el-form
      ref="form"
      :model="formData"
      :rules="rules"
      label-width="100px"
      style="padding-right: 30px"
    >
      <el-form-item prop="cate_name" label="分类名称">
        <el-input v-model="formData.cate_name" placeholder="请输入分类名称"> </el-input>
      </el-form-item>
      <el-form-item prop="cate_alias" label="分类别名" wigth="100px">
        <el-input v-model="formData.cate_alias" placeholder="请输入分类别名"> </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="clickConfirm"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>


<style>
</style>

