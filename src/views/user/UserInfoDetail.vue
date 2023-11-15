<script setup>
import { useUserStore } from '@/stores/user.js'
import { onMounted, ref, unref } from 'vue'
import user from '@/api/user.js'
import router from '@/router'

import UserDetail from '../../components/UserDetail.vue'
import UpdatePassword from '../../components/UpdatePassword.vue'
import UserFollow from '../../components/UserFollow.vue'
//表单数据
const formModel = ref({
  account: '',
  password: '',
  repassword: '',
  name: '',
  avatar: ''
})

//初始化用户登录信息
let isLogin = ref(false)
onMounted(() => {
  const userStore = useUserStore()
  const { user } = userStore
  if (user.id !== '' && user.id !== undefined) {
    isLogin.value = true
    formModel.value = user
  }
  changeBackgroundColor(0)
})
const userStore = useUserStore()
const activeIndex = ref({ value: 0 })
const menuItems = ref(['个人资料', '我的关注', '修改密码', '退出登录'])
const changeBackgroundColor = async (index) => {
  if (index === 3) {
    await ElMessageBox.confirm('您确定退出吗', {
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    })
    userStore.removeToken()
    userStore.setUser({})
    router.push(`/login`)
  }
  activeIndex.value = index
  let editItem = document.querySelectorAll('.edit-item')
  editItem.forEach((editItem) => (editItem.style.backgroundColor = ''))
  editItem[index].style.backgroundColor = '#ffecbd'
}

// 头像上传
const uploadAvatar = (file) => {
  const a = new FileReader()
  a.readAsDataURL(file.raw)
  a.onload = (e) => {
    let base64 = e.target.result
    formModel.value.avatar = base64
    user.updateService(formModel.value)
  }
}
const buttonRef = ref()
const popoverRef = ref()
const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
}
</script>
<template>
  <div class="home" style="width: 100vw; height: 100vh; background-color: #fff">
    <div class="header-container" style="position: fixed; width: 100%">
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
          height: 80%;
          background-color: #fff;
          margin: 0 auto;
          margin-top: 5px;
          display: flex;
        "
      >
        <div
          class="infoLeft"
          style="
            padding: 10px;
            width: 25%;
            height: 100vh;
            display: flex;
            flex-direction: column;
            background-color: #fff;
            border-right: 1px solid #f4f4f4;
          "
        >
          <div class="left_item">
            <el-avatar :size="100" :src="formModel.avatar" />
          </div>
          <div class="left_item">
            <h2 style="margin-top: 5px">{{ formModel.name }}</h2>
          </div>
          <div style="display: flex; justify-content: center">
            <el-upload
              ref="uploadRef"
              class="upload-demo"
              style="display: flex"
              @change="uploadAvatar"
              :auto-upload="false"
              :show-file-list="false"
            >
              <el-button type="primary">修改头像</el-button>
            </el-upload>
          </div>

          <div
            class="left_item"
            style="margin-top: 10px; width: 50%; height: 100%"
          >
            <ul style="margin-right: auto">
              <li
                class="edit-item"
                v-for="(item, index) in menuItems"
                :key="index"
                @click="changeBackgroundColor(index)"
                style="color: #7f7f7f"
              >
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
        <div class="infoRight" style="width: 70%">
          <UserDetail v-if="activeIndex === 0"></UserDetail>
          <UserFollow v-if="activeIndex === 1"></UserFollow>
          <UpdatePassword v-if="activeIndex === 2"></UpdatePassword>
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
.edit-item {
  cursor: pointer;
}
.edit-item:hover {
  background-color: #ffecbd;
}
.banner {
}
.left_item {
  margin-left: auto;
  margin-right: auto;
  margin-top: 5px;
}
</style>
