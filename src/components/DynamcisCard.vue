<script setup>
import { useUserStore } from '@/stores/user.js'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import user from '@/api/user.js'
import dynamics from '@/api/dynamics.js'
const formModel = ref({
  account: '',
  password: '',
  repassword: '',
  name: '',
  avatar: ''
})
let randomId = ref('')
let isLogin = ref(false)

let list = ref([])
onMounted(() => {
  const userStore = useUserStore()
  const { user } = userStore
  if (user.id !== '' && user.id !== undefined) {
    isLogin.value = true
    formModel.value = user
    form.value.userAccount = user.account
    getDynamicsByUserAccount()
  }
})
//获取动态列表
const getDynamics = (account) => {
  dynamics.getDynamics(account).then((res) => {
    list.value = res.data.data
    checkLike()
    setComment()
    console.log(list.value, 'list')
  })
}
let isAdd = ref(true)
let limit = 5
let currentLimit = 0
//列表懒加载
const scrollTop = ref(0)
const getDynamicsByUserAccount = () => {
  if (!isAdd.value) {
    return
  }
  dynamics
    .getDynamicsByUserAccount(formModel.value.account, currentLimit, limit)
    .then((res) => {
      if (res.data.code === 1) {
        console.log(res.data.data, 'res.data.data')
        // list.value = res.data.data
        if (res.data.data.length < limit) {
          isAdd.value = false
        } else {
          currentLimit += limit
        }
        list.value = [...list.value, ...res.data.data]
      }
    })
}
const handleScroll = () => {
  scrollTop.value =
    document.documentElement.scrollTop || document.body.scrollTop
}
watch(scrollTop, (newValue) => {
  const scrollHeight = document.documentElement.scrollHeight
  const clientHeight = document.documentElement.clientHeight

  if (newValue + clientHeight >= scrollHeight) {
    getDynamicsByUserAccount()
  }
})

// 添加滚动事件监听
window.addEventListener('scroll', handleScroll)

// 销毁前移除滚动事件监听
const beforeUnmount = () => {
  window.removeEventListener('scroll', handleScroll)
}
onBeforeUnmount(() => {
  beforeUnmount()
})
//动态表单
const form = ref({
  descContent: '',
  userAccount: formModel.value.account,
  id: randomId.value
})
defineExpose({
  getDynamics
})
//点赞表单
const likeForm = ref({
  dynamicsId: '',
  userAccount: ''
})
//保存点赞信息
const dyLike = (index, id) => {
  let isLike = list.value[index].isLike
  if (!isLike) {
    console.log(isLike, 'isLike')
    likeForm.value.dynamicsId = id
    likeForm.value.userAccount = formModel.value.account
    list.value[index].likeCount = list.value[index].likeCount + 1
    list.value[index].isLike = true
    dynamics.dylike(likeForm.value).then((res) => {
      console.log(res)
    })
  }
}
//检查是否点赞
const checkLike = () => {
  list.value.forEach((item, index) => {
    item.dyLikes.forEach((item) => {
      if (item.userAccount === formModel.value.account) {
        list.value[index].isLike = true
      }
    })
  })
}
//初始化评论
const setComment = () => {
  list.value.forEach((item) => {
    item.isComment = false
  })
}
//设置当前评论
const setCurrentComment = (index) => {
  setComment()
  list.value[index].isComment = true
}
//评论表单
let commentForm = ref({
  dynamicsId: '',
  commentUserAccount: formModel.value.account,
  commentContent: '',
  commentUserName: ''
})
//发布评论表单
const publishComment = (index, id) => {
  commentForm.value.commentUserName = formModel.value.name
  commentForm.value.commentUserAccount = formModel.value.account
  commentForm.value.dynamicsId = id
  dynamics.publishComment(commentForm.value).then((res) => {
    console.log(res)
    if (res.data.code === 1) {
      list.value[index].comments.push(commentForm.value)
      commentForm.value = {}
      console.log(list.value)
    }
  })
}
</script>
<template>
  <div
    v-for="(item, index) in list"
    :key="item.id"
    class="card"
    style="
      margin-top: 30px;
      margin-left: 100px;
      border-bottom: 1px solid #ccc;
      margin-bottom: 5px;
      overflow: auto;
    "
  >
    <div class="card_head" style="display: flex">
      <el-avatar :size="50" :src="formModel.avatar" />
      <div style="margin-left: 5px; margin-top: 5px">
        <div class="card_head_name">
          {{ formModel.name }}
        </div>
        <div>{{ item.createTime }}</div>
      </div>
    </div>
    <div class="card_body" style="margin-top: 10px">
      <div>
        <span>{{ item.descContent }}</span>
      </div>
      <ul style="display: flex; flex-wrap: wrap">
        <li v-for="(item, index) in item.imgs" :key="index">
          <img
            style="width: 200px; height: 200px; margin-right: 2px"
            :src="item"
            alt=""
          />
        </li>
      </ul>
    </div>
    <div class="card_bottom" style="display: flex; margin-top: 10px">
      <span
        style="cursor: pointer; font-size: 15px; margin-right: 7px"
        @click="dyLike(index, item.id)"
        ><img
          v-if="!item.isLike"
          style="size: width: 15px;height: 15px"
          src="/src/assets/thumb-up.svg"
          alt=""
        />
        <img
          v-if="item.isLike"
          style="size: width: 15px;height: 15px"
          src="/src/assets/thumb-up-fill.svg"
          alt=""
        />

        点赞:{{ item.likeCount }}</span
      >
      <span
        style="font-size: 15px; cursor: pointer"
        @click="setCurrentComment(index)"
      >
        <el-icon><ChatDotRound /></el-icon>
        <span>评论</span></span
      >
    </div>
    <div v-for="commont in item.comments" :key="commont.commentUserAccount">
      <div style="margin-bottom: 5px; margin-top: 5px">
        <span style="color: #2c5883">{{ commont.commentUserName }}</span
        >:<span style="margin-left: 5px; font-size: 15px">{{
          commont.commentContent
        }}</span>
      </div>
    </div>
    <div v-if="item.isComment" style="display: flex">
      <el-input
        v-model="commentForm.commentContent"
        placeholder="恶语伤人心，善语结良缘~"
      ></el-input
      ><el-button @click="publishComment(index, item.id)">发表</el-button>
    </div>
  </div>
</template>
<style scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
li {
  list-style: none;
}
ul {
  list-style: none;
}
</style>
