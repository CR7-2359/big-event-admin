<script setup>
import {userRegisterServise, userLoginServise,userGetInfoService} from '@/api/user'
import {useUserStore} from '@/stores/index'
import { User, Lock } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
const isRegister = ref(false)
const router = useRouter()

const form = ref()
const formData = ref({
  uname:'',
  upassword:'',
  againPword:''
})

//登录逻辑
const login = async ()=>{
  form.value.validate(async (valid) => {
    if (valid) {
      const res = await userLoginServise(formData.value.uname,formData.value.upassword)
      ElMessage({
        message: '登录成功',
        type: 'success',
      })
      const user = useUserStore()
      user.setToken(res.data.token)
      console.log(res)
      //页面跳转
      router.push('/')
    } else {
      console.log('校验失败，请检查表单')
    }
  })
}

//注册逻辑
const register = async () => {
  form.value.validate(async (valid) => {
    if (valid) {
      const res = await userRegisterServise(formData.value.uname,formData.value.upassword,formData.value.againPword)
      ElMessage({
        message: '注册成功',
        type: 'success',
      })
      console.log(res)
      isRegister.value = !isRegister.value
    } else {
      console.log('校验失败，请检查表单')
    }
  })
}

//切换登录/注册重置表单
watch(isRegister, ()=>{
  form.value.resetFields()
})

const againFun = (rule, value, callback) => {
  // 校验逻辑
  if (value !== formData.value.upassword) {
    callback(new Error('两次密码不一致'))
  } else {
    callback() // 校验通过
  }
}

//校验规则
const rules = ref({
  uname: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 10, message: '长度在3到10个字符', trigger: 'blur' }
  ],
  upassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  againPword:[
    { required:true, validator: againFun, trigger: 'blur' }
  ],
})


</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <el-form ref="form" :model="formData" :rules="rules" size="large" autocomplete="off" v-if="isRegister">
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="uname">
          <el-input
          :prefix-icon="User"
          v-model="formData.uname"
          placeholder="请输入用户名">
        </el-input>
        </el-form-item>
        <el-form-item prop="upassword">
          <el-input
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            v-model="formData.upassword"
          ></el-input>
        </el-form-item>
        <el-form-item prop="againPword">
          <el-input
            :prefix-icon="Lock"
            type="password"
            v-model="formData.againPword"
            placeholder="请输入再次密码"
          ></el-input>
        </el-form-item>
        <el-form-item @click="register">
          <el-button class="button" type="primary" auto-insert-space>
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>
      <el-form :model="formData" :rules="rules" ref="form" size="large" autocomplete="off" v-else>
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="uname">
          <el-input
           v-model="formData.uname"
           :prefix-icon="User"
           placeholder="请输入用户名">
          </el-input>
        </el-form-item>
        <el-form-item prop="upassword">
          <el-input
            v-model="formData.upassword"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item @click="login">
          <el-button class="button" type="primary" auto-insert-space
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background: url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
