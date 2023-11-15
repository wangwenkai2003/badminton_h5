<script setup>
import { useUserStore } from '@/stores/user.js'
import { onMounted, ref } from 'vue'
import user from '@/api/user.js'
import dynamics from '@/api/dynamics.js'
import { ElMessage } from 'element-plus'
import DynamcisCard from './DynamcisCard.vue'

//基本信息表单
let formModel = ref({
  account: '',
  password: '',
  repassword: '',
  name: '',
  avatar: ''
})
let randomId = ref('')
randomId.value =
  Math.random().toString(36).substring(2) + Date.now().toString(36)
let isLogin = ref(false)
onMounted(() => {
  const userStore = useUserStore()
  const { user } = userStore
  if (user.id !== '' && user.id !== undefined) {
    isLogin.value = true
    formModel.value = user
    form.value.userAccount = user.account
  }
})
//动态表单
let form = ref({
  descContent: '',
  userAccount: formModel.value.account,
  id: randomId.value
})
//动态卡片
const dynamcisCardRef = ref('')
//发布动态表单
const onSubmitDynamic = () => {
  console.log(form.value, 'fv')
  dynamics.save(form.value).then((res) => {
    if (res.data.code === 1) {
      ElMessage.success(res.data.msg)
      form.value = ref('')
      fileList.value = []
      if (dynamcisCardRef.value) {
        dynamcisCardRef.value.getDynamics(formModel.value.account)
      }
    }
    randomId.value =
      Math.random().toString(36).substring(2) + Date.now().toString(36)
  })
}

//文件上传表单
const fileForm = ref({
  data: '',
  fileName: '',
  userAccount: '',
  dynamicsId: randomId.value
})
//图片清单
let fileList = ref([])

// 图片文件上传
const openFileSelector = (file) => {
  const a = new FileReader()
  a.readAsDataURL(file.raw)
  a.onload = (e) => {
    let base64 = e.target.result
    fileForm.value.data = base64
    fileForm.value.fileName = file.name
    fileForm.value.userAccount = formModel.value.account
    user.imgService(fileForm)
  }
}
</script>
<template>
  <div>
    <el-form :model="form" label-width="120px">
      <el-form-item>
        <el-input
          placeholder="分享此刻吧~"
          v-model="form.descContent"
          type="textarea"
        />
      </el-form-item>
      <el-form-item>
        <div
          style="display: flex; width: 100%; border-bottom: 2px solid #f4f4f4"
        >
          <el-upload
            ref="uploadRef"
            class="upload-demo"
            style="display: flex"
            @change="openFileSelector"
            :auto-upload="false"
            list-type="picture-card"
            v-model:file-list="fileList"
          >
            <el-icon size="30" style="margin-left: 10px"
              ><el-icon><PictureRounded /></el-icon
            ></el-icon>
          </el-upload>
          <el-button
            type="primary"
            style="margin-left: auto; margin-top: auto; margin-bottom: auto"
            @click="onSubmitDynamic"
            >发表</el-button
          >
        </div>
      </el-form-item>
    </el-form>
    <DynamcisCard ref="dynamcisCardRef"></DynamcisCard>
  </div>
</template>
