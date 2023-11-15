<script setup>
import { useUserStore } from '@/stores/user.js'
import { onMounted, ref, unref } from 'vue'
import { ChatDotRound, UserFilled } from '@element-plus/icons-vue'
import router from '@/router'

import SchoolDynamics from '@/components/SchoolDynamics.vue'
import MyDynamics from '@/components/MyDynamics.vue'
import FollowDynamics from '@/components/FollowDynamics.vue'

const formModel = ref({
  account: '',
  password: '',
  repassword: '',
  name: '',
  avatar: ''
})
//初始化用户信息
let isLogin = ref(false)
onMounted(() => {
  const userStore = useUserStore()
  const { user } = userStore
  if (user.id !== '' && user.id !== undefined) {
    isLogin.value = true
    formModel.value = user
  }
})

const buttonRef = ref()
const popoverRef = ref()
const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
}
//切换动态选择
let activeDynamics = ref(1)

const onClick = (item) => {
  activeDynamics.value = item
  console.log(activeDynamics)
  const banner_header_item = document.querySelectorAll('#banner-header-item')
  banner_header_item.forEach((item) => {
    item.style.borderBottom = 'none'
  })
  banner_header_item[item].style.borderBottom = '1px solid #0077a1'
}
</script>
<template>
  <div class="home" style="width: 100vw; background-color: #fff">
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
        style="width: 80%; height: 80%; margin: 0 auto; margin-top: 5px"
      >
        <div
          class="banner-header"
          style="display: flex; justify-content: space-evenly"
        >
          <div
            class="header-item"
            id="banner-header-item"
            style="margin-right: 10px; color: #1f2124"
            @click="onClick(0)"
          >
            <el-icon><ChatDotRound /></el-icon> <span>好友动态</span>
          </div>
          <div
            class="header-item"
            id="banner-header-item"
            style="margin-right: 10px; color: #1f2124"
            @click="onClick(1)"
          >
            <el-icon><House /></el-icon> <span>本校动态</span>
          </div>
          <div
            class="header-item"
            id="banner-header-item"
            style="margin-right: 10px; color: #1f2124"
            @click="onClick(2)"
          >
            <el-icon><UserFilled /></el-icon> <span>我的动态</span>
          </div>
        </div>
        <div style="display: flex; justify-self: center">
          <div style="width: 80%; margin-left: auto; margin-right: auto">
            <FollowDynamics v-if="activeDynamics === 0"></FollowDynamics>
            <schoolDynamics v-if="activeDynamics === 1"></schoolDynamics>
            <MyDynamics v-if="activeDynamics === 2"></MyDynamics>
          </div>
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
  cursor: pointer;
  color: #0077a1;
  border-bottom: #0077a1 1px solid; /* 替换为您想要的悬停后的字体颜色 */
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
