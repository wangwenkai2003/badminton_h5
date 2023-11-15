<script setup>
import { useUserStore } from '@/stores/user.js'
import { onMounted, ref, unref } from 'vue'
import notice from '@/api/notice.js'
import { ElMessage } from 'element-plus'
const formModel = ref({
  account: '',
  password: '',
  repassword: '',
  name: '',
  avatar: ''
})

let isLogin = ref(false)
onMounted(() => {
  const userStore = useUserStore()
  const { user } = userStore
  if (user.id !== '' && user.id !== undefined) {
    isLogin.value = true
    formModel.value = user
  }
  notice.getLimit().then((res) => {
    currentNotices.value = res.data.data
  })
})

const buttonRef = ref()
const popoverRef = ref()
const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
}
//当前通告
let currentNotices = ref([])
//图片清单
let fileList = ref([])

//图片表单
let noticeImgs = ref([])
// 图片文件上传
const openFileSelector = (file) => {
  const a = new FileReader()
  a.readAsDataURL(file.raw)
  a.onload = (e) => {
    let base64 = e.target.result
    let item = { fileName: file.name, data: base64 }
    noticeImgs.value.push(item)
  }
}

const handleRemove = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const handlePreview = (file) => {
  console.log(file)
}
//上传通告
const uploadNotices = () => {
  if (noticeImgs.value.length > 5) {
    ElMessage.error('最多上传5张图片')
    return
  }
  if (noticeImgs.value.length === 0) {
    ElMessage.error('最少上传图片')
    return
  }
  notice.save(noticeImgs.value).then((res) => {
    if (res.data.code === 1) {
      noticeImgs.value = []
      ElMessage.success('上传成功')
      location.reload(true)
    }
  })
}
//修改通告
const updateNotice = (item) => {
  // 创建一个 input 元素
  const input = document.createElement('input')
  input.type = 'file'
  input.style.display = 'none'

  // 监听文件选择器的 change 事件
  input.addEventListener('change', (event) => {
    // 处理选定的文件
    const selectedFile = event.target.files[0]

    // 读取文件内容
    const reader = new FileReader()
    reader.onload = (e) => {
      const fileContent = e.target.result

      // 执行文件上传等操作
      item.data = fileContent
      console.log(selectedFile.name)
      item.fileName = selectedFile.name
      notice.updateNotice(item).then((res) => {
        if (res.data.code === 1) {
          ElMessage.success(res.data.data)
        }
      })
    }
    // 读取文件内容
    reader.readAsDataURL(selectedFile)
  })

  // 模拟点击 input 元素
  input.click()
}
</script>
<template>
  <div
    class="home"
    style="
      width: 100vw;
      height: 100vh;
      overflow-y: scroll;
      background-color: #fff;
    "
  >
    <div class="header-container" style="width: 100%">
      <div
        class="header"
        style="
          display: flex;
          /* width: 100%; */
          background-color: #010302;
          padding: 10px;
          position: relative;
        "
      >
        <div
          class="header-left"
          style="
            display: flex;
            margin-left: auto;
            margin-top: auto;
            margin-bottom: auto;
          "
        >
          <div class="header-item" style="margin-right: 10px; color: #ffecbd">
            <router-link class="header-link" style="color: #ffecbd" to="/"
              >首页</router-link
            >
          </div>
          <div class="header-item" style="margin-right: 10px; color: #ffecbd">
            <router-link
              class="header-link"
              style="color: #ffecbd"
              to="/community"
              >社区</router-link
            >
          </div>
          <div class="header-item" style="margin-right: 10px; color: #ffecbd">
            <router-link
              class="header-link"
              style="color: #ffecbd"
              to="/reserve"
              >场地预约</router-link
            >
          </div>
        </div>
        <div
          class="header-right"
          style="
            display: flex;
            color: #ffecbd;
            margin-left: auto;
            margin-right: 50px;
          "
        >
          <div class="header-item" id="userLogin" v-if="!isLogin">
            <router-link class="header-link" style="color: #ffecbd" to="/login"
              >登录</router-link
            >
          </div>
          <div
            class="header-item"
            id="userLogin"
            v-if="isLogin"
            ref="buttonRef"
            v-click-outside="onClickOutside"
          >
            <el-avatar :src="formModel.avatar" />
            <el-popover
              ref="popoverRef"
              :virtual-ref="buttonRef"
              trigger="click"
              :width="80"
              virtual-triggering
            >
              <ul>
                <li>
                  <router-link
                    class="header-link"
                    style="color: #010302"
                    to="/userInfoDetail"
                    >个人中心</router-link
                  >
                </li>
                <li>
                  <router-link
                    class="header-link"
                    style="color: #010302"
                    to="/login"
                    >我的社区</router-link
                  >
                </li>
                <li>
                  <router-link
                    class="header-link"
                    style="color: #010302"
                    to="/login"
                    >我的预约</router-link
                  >
                </li>
              </ul>
            </el-popover>
          </div>
        </div>
      </div>
      <div
        class="banner"
        style="
          width: 80%;
          background-color: #f4f4f4;
          margin: 0 auto;
          margin-top: 5px;
          display: flex;
          flex-direction: column;
        "
      >
        <el-upload
          v-model:file-list="fileList"
          class="upload-demo"
          drag
          @change="openFileSelector"
          :auto-upload="false"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          multiple
          limit="5"
          list-type="picture"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">拖拽文件或 <em>点击上传</em></div>
        </el-upload>
        <el-button
          style="
            margin-left: auto;
            margin-right: 10px;
            margin-bottom: 5px;
            margin-bottom: 20px;
          "
          type="primary"
          @click="uploadNotices"
          >确认发布</el-button
        >
        <div v-for="item in currentNotices" :key="item.id">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span
                  >图片名称:
                  <span style="color: #999999">{{ item.fileName }}</span></span
                >
                <div>
                  <span>发布时间:</span
                  ><span style="color: #999999">{{ item.createTime }}</span>
                </div>
              </div>
            </template>
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: space-between;
              "
            >
              <el-image
                style="width: 100px; height: 100px"
                :src="item.data"
              ></el-image>

              <el-button
                type="primary"
                style="padding: 5px"
                @click="updateNotice(item)"
                >修改</el-button
              >
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.header-link {
  text-decoration: none;
  color: #ffecbd;
}
.header-link:hover {
  color: #fff;
}
.header-item:hover {
  color: #fff; /* 替换为您想要的悬停后的字体颜色 */
}

ul {
  display: flex;
  flex-direction: column;
  list-style: none;
}
li {
  margin-left: auto;
  margin-right: auto;
  list-style: none;
  border-bottom: 1px #f4f4f4 solid;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}
</style>
