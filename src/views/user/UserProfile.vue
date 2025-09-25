<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { userUpdateInfoService } from '@/api/user'
import { useUserStore } from '@/stores'
const user = useUserStore()
const { username, nickname, email, id, user_pic } = user.UserInfo
// 表单数据
const formData = ref({ username, nickname, email, id, user_pic })

// 表单校验规则
const formRules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在2到10个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱格式',
      trigger: 'blur',
    },
  ],
}

// 表单引用
const formRef = ref()

// 提交表单
const submitForm = async () => {
  await formRef.value.validate()
  await userUpdateInfoService(formData)
  await user.getUserInfo()
  ElMessage({ type: 'success', message: '修改成功' })
}
</script>

<template>
  <PageContainer title="基本资料">
    <div class="user-form-container">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        style="max-width: 600px"
      >
        <!-- 1. 登录名称（禁用） -->
        <el-form-item label="登录名称" prop="username">
          <el-input v-model="formData.username" disabled />
        </el-form-item>

        <!-- 2. 用户昵称（可输入+校验） -->
        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="formData.nickname" placeholder="请输入2-10位昵称" clearable />
        </el-form-item>

        <!-- 3. 用户邮箱（可输入+校验） -->
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入有效邮箱" clearable />
        </el-form-item>

        <!-- 4. 提交按钮 -->
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </PageContainer>
</template>

<style lang="scss" scoped>
</style>
