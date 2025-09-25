<script setup>
import { ref, computed } from 'vue'
import { Plus, Upload } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
// import { ElMessage } from 'element-plus'        无需手动导入，直接使用即可
import { userUpdateAvatarService } from '@/api/user'
import PageContainer from '@/components/PageContainer.vue'

const userStore = useUserStore()

// 声明上传组件的引用
const uploadRef = ref() // 上传组件的引用
const selectedFile = ref(null) // 添加文件选择响应式变量
const imgUrl = ref(userStore.UserInfo?.user_pic || '')

// 计算属性：是否可以选择文件（用于禁用上传按钮）
const isFileSelected = computed(() => {
  return selectedFile.value !== null
})

// 文件选择函数
// 文件选择函数（用于按钮点击）
const handleSelectImage = () => {
  // 创建一个隐藏的文件输入元素
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = 'image/*' // 只允许选择图片文件
  fileInput.style.display = 'none'

  // 监听文件选择事件
  fileInput.onchange = (event) => {
    const file = event.target.files[0]
    if (file) {
      // 保存选中的文件
      selectedFile.value = file

      // 生成预览图
      const reader = new FileReader()
      reader.onload = (e) => {
        imgUrl.value = e.target.result
      }
      reader.onerror = (error) => {
        console.error('文件读取错误:', error)
        ElMessage.error('文件读取失败')
      }
      reader.readAsDataURL(file)
    }
  }

  // 触发文件选择对话框
  fileInput.click()
}

// 文件选择函数（用于Element Plus上传组件）
const onUploadFile = (file) => {
  selectedFile.value = file.raw
  // 生成预览图
  const reader = new FileReader()
  reader.onload = (e) => {
    imgUrl.value = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

// 上传头像函数
const handleUploadAvatar = async () => {
  if (!selectedFile.value) {
    ElMessage.warning('请先选择要上传的头像图片')
    return
  }

  try {
    // 将图片转换为base64格式
    const base64Data = await convertFileToBase64(selectedFile.value)

    // 调用API服务更新头像
    const res = await userUpdateAvatarService(base64Data)
    console.log(res.data)
    if (res.data.code === 0) {
      ElMessage({
        message: '头像上传成功',
        type: 'success',
      })
      // 重新获取用户信息，更新用户头像
      await userStore.getUserInfo()
      imgUrl.value = userStore.user?.user_pic || ''
    } else {
      console.log('code is ', res.data.code)
      ElMessage.error(res.data.message || '头像上传失败')
    }
  } catch (error) {
    console.error('上传头像时发生错误:', error)
    ElMessage.error('网络错误，请稍后重试')
  }
}

// 将文件转换为base64格式
const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      resolve(e.target.result)
    }
    reader.onerror = (error) => {
      reject(error)
    }
    reader.readAsDataURL(file)
  })
}
</script>

<template>
  <page-container title="更换头像">
    <el-row>
      <el-col :span="12">
        <el-upload
          ref="uploadRef"
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onUploadFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <img v-else src="@/assets/avatar.jpg" width="278" />
        </el-upload>
        <br />
        <el-button type="primary" :icon="Plus" size="large" @click="handleSelectImage">
          选择图片
        </el-button>
        <el-button
          type="success"
          :icon="Upload"
          size="large"
          @click="handleUploadAvatar"
          :disabled="!isFileSelected"
        >
          上传头像
        </el-button>
      </el-col>
    </el-row>
  </page-container>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>
