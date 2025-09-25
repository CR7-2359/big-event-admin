<script setup>
import {ref, defineExpose} from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import {Plus} from '@element-plus/icons-vue'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { QuillEditor } from '@vueup/vue-quill';
import {articleGetDitailService,artAddDtaiService} from '@/api/article'
import request, { baseURL } from '@/utils/request';
const emit = defineEmits(['success'])
const drawerShow = ref(false)
const formRef = ref()
const formData = ref({
  id:'',
  title:'',
  cate_id:'',
  content:'',
  cover_img: null,
  state:'',
})

const defaultFormData = ref({
  ...formData.value
})

//用于显示隐藏抽屉的暴露函数
const open = async (obj) => {
  drawerShow.value = true;
  formData.value = { ...defaultFormData.value };
  imgUrl.value = '';
  editorRef.value.setText('');
  formData.value.id = obj.id;

  if (formData.value.id) {
    const { data: { data } } = await articleGetDitailService(formData.value.id);
    formData.value = data;

    // 处理图片URL
    if (data.cover_img) {
      imgUrl.value = baseURL + data.cover_img;
      try {
        // 提取文件名（从URL或使用默认）
        const fileName = data.cover_img.split('/').pop() || 'cover.jpg';
        formData.value.cover_img = await imageUrlToFile(imgUrl.value, fileName);
      } catch {
        // 转换失败时保持原URL
        formData.value.cover_img = data.cover_img;
      }
    }
  }
};

const imgUrl = ref('')
//图片成功上传的钩子
const onUploadFile = (uploadFile) => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw)
  formData.value.cover_img = uploadFile.raw
}

const editorRef = ref()

//富文本编辑器------相关配置
const editorOption = ref({
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['image'],
    ],
  },
  placeholder: '请输入内容...',
  theme: 'snow',
})

//提交请求
const onSubmit = async (state)=>{
  //把状态存入formData
  formData.value.state = state

  // 转换 formData 数据
  const fd = new FormData()
  for (let key in formData.value) {
    fd.append(key, formData.value[key])
  }

  // 发送请求
  if(formData.value.id){
    //编辑文章
    await artAddDtaiService(fd)
    emit('success','edit')
  }else{
    //发布文章
    await artAddDtaiService(fd)
    emit('success','add')
  }

  ElMessage({
    type:'success',
    message: formData.value.id?'编辑成功':'发布成功'
  })

  drawerShow.value = false
}
// 将网络图片地址转换为File对象
// 将网络图片地址转换为File对象
async function imageUrlToFile(url, fileName) {
  try {
    // 第一步：使用fetch获取网络图片数据（避免axios的headers问题）
    const response = await fetch(url);
    if (!response.ok) throw new Error('网络响应不正常');

    // 第二步：获取content-type（有默认值）
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // 第三步：获取图片数据
    const imageData = await response.arrayBuffer();

    // 第四步：创建File对象
    return new File([imageData], fileName, { type: contentType });

  } catch (error) {
    console.error('图片转换失败:', error);
    // 返回一个默认的File对象避免中断流程
    return new File([new Blob()], fileName, { type: 'image/jpeg' });
  }
}
defineExpose({
  open
})
</script>

<template>
  <el-drawer
  v-model="drawerShow"
  :title="formData.id ? '编辑文章' : '添加文章'"
  direction="rtl"
  size="40%"
  >
    <el-form :model="formData" ref="formRef" label-width="100px" prop="title">
      <el-form-item label="文章标题">
        <el-input
        :title="formData.title"
        v-model="formData.title"
        placeholder="请输入标题"
      >
        </el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <ChannelSelect v-model="formData.cate_id"></ChannelSelect>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <el-upload
        class="avatar-uploader"
        :show-file-list="false"
        :on-change="onUploadFile"
        :auto-upload="false"
        action=""
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="edit">
          <QuillEditor
           ref="editorRef"
           style="width: 100%;"
           :options="editorOption"
           v-model:content="formData.content"
           contentType="html"
          />
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSubmit('已发布')" type="primary">发布</el-button>
        <el-button @click="onSubmit('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
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
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.edit {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
