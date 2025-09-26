<script setup>
import { ref, reactive } from 'vue'
// import { ElMessage } from 'element-plus'
import { userUpdatePassService } from '@/api/user'

// 表单数据
const pwdForm = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: '',
})

// 表单引用
const pwdFormRef = ref()

// 表单校验规则
const rules = reactive({
  old_pwd: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { min: 6, max: 15, message: '长度应为6-15个字符', trigger: 'blur' },
  ],
  new_pwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 15, message: '长度应为6-15个字符', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value === pwdForm.value.old_pwd) {
          callback(new Error('新密码不能与原密码相同'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  re_pwd: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { min: 6, max: 15, message: '长度应为6-15个字符', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== pwdForm.value.new_pwd) {
          callback(new Error('确认密码与新密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
})

// 修改密码
const submitForm = async () => {
  if (!pwdFormRef.value) return
  await pwdFormRef.value.validate(async (valid) => {
    if (valid) {
      // 这里可以调用修改密码的API
      const {
        data: { code, message },
      } = await userUpdatePassService(pwdForm.value)

      if (code === 0) {
        ElMessage.success(message)
        console.log('res is ', message)
      } else {
        ElMessage.error(message)
        console.log('res is ', message)
      }
      resetForm()
    }
  })
}

// 重置表单
const resetForm = () => {
  pwdFormRef.value.resetFields()
}
</script>

<template>
  <el-card class="password-card">
    <template #header>
      <div class="card-header">
        <span>修改密码</span>
      </div>
    </template>
    <el-form
      ref="pwdFormRef"
      :model="pwdForm"
      :rules="rules"
      label-width="100px"
      style="max-width: 500px"
    >
      <el-form-item label="原密码" prop="old_pwd">
        <el-input
          v-model="pwdForm.old_pwd"
          type="password"
          show-password
          placeholder="请输入原密码"
        />
      </el-form-item>

      <el-form-item label="新密码" prop="new_pwd">
        <el-input
          v-model="pwdForm.new_pwd"
          type="password"
          show-password
          placeholder="请输入新密码"
        />
      </el-form-item>

      <el-form-item label="确认密码" prop="re_pwd">
        <el-input
          v-model="pwdForm.re_pwd"
          type="password"
          show-password
          placeholder="请再次输入新密码"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">修改密码</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style scoped>
.password-card {
  max-width: 600px;
  margin: 20px auto;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
}
</style>
