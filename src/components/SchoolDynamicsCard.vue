<script setup>
import { useUserStore } from '@/stores/user.js'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import user from '@/api/user.js'
import dynamics from '@/api/dynamics.js'
import { ElMessage, ElMessageBox } from 'element-plus'
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
    // getDynamicsList()
    getDynamicsPage()
  }
})
//获取动态列表
const getDynamicsList = () => {
  dynamics.getDynamicsList().then((res) => {
    list.value = res.data.data
    checkLike()
    setComment()
    getMyFollow()
    console.log(list.value, 'list')
  })
}
let isAdd = ref(true)
let limit = 5
let currentLimit = 0
//列表懒加载
const scrollTop = ref(0)
const getDynamicsPage = () => {
  if (!isAdd.value) {
    return
  }
  dynamics.getDynamicsPage(currentLimit, limit).then((res) => {
    if (res.data.code === 1) {
      console.log(res.data.data, 'res.data.data')
      // list.value = res.data.data
      if (res.data.data.length < limit) {
        isAdd.value = false
      } else {
        currentLimit += limit
      }
      list.value = [...list.value, ...res.data.data]
      checkLike()
      setComment()
      getMyFollow()
      console.log(list.value, 'list')
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
    getDynamicsPage()
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
  getDynamicsList
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
//关注表单
const followForm = ref({
  befollowUserAccount: '',
  followUserAccount: ''
})
//保存关注
const saveFollow = (befollowUserAccount, index) => {
  followForm.value.befollowUserAccount = befollowUserAccount
  followForm.value.followUserAccount = formModel.value.account
  user.saveFollow(followForm.value).then((res) => {
    console.log(res, 'fxxollow')
    list.value.forEach((item) => {
      if (item.userAccount === list.value[index].userAccount) {
        item.isFollow = true
      }
    })
  })
}
//关注列表
let followList = ref([])
//获取关注列表
const getMyFollow = () => {
  user.getMyFollow(formModel.value.account).then((res) => {
    console.log(res, 'userfollow')
    if (
      res.data.data !== null &&
      res.data.data !== undefined &&
      res.data.data.length > 0
    ) {
      followList.value = res.data.data
      checkFollow()
    }
  })
}
//检查是否关注
const checkFollow = () => {
  list.value.forEach((item) => {
    followList.value.forEach((follow) => {
      if (item.userAccount === follow.account) {
        item.isFollow = true
      }
    })
  })
}
// 取消关注
const cancelFollow = async (item) => {
  await ElMessageBox.confirm('您确定取消关注吗', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  followForm.value.befollowUserAccount = item.userAccount
  followForm.value.followUserAccount = formModel.value.account
  console.log(followForm.value, 'followForm')
  user.cancelFollow(followForm.value).then((res) => {
    if (res.data.code === 1) {
      list.value.forEach((item, index) => {
        if (item.userAccount === list.value[index].userAccount) {
          item.isFollow = false
        }
      })
    }
  })
}
//删除动态
const deleteDynamics = async (item) => {
  await ElMessageBox.confirm('您确定删除该条动态吗', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  console.log(item, 'item')
  dynamics.deleteById(item.id).then((res) => {
    if (res.data.code === 1) {
      list.value = list.value.filter((dynam) => dynam.id !== item.id)
      ElMessage.success(res.data.data)
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
      <el-avatar :size="50" :src="item.user.avatar" />
      <div style="margin-left: 5px; margin-top: 5px">
        <div class="card_head_name">
          {{ item.user.name }}
          <button
            @click="saveFollow(item.user.account, index)"
            v-if="item.user.account !== formModel.account && !item.isFollow"
            style="
              background-color: #00b8f6;
              border: 1px solid;
              cursor: pointer;
              padding: 1px;
              color: #fff;
            "
          >
            <el-icon><Plus /></el-icon
            ><span style="margin-left: 1px">关注</span>
          </button>

          <button
            @click="cancelFollow(item, index)"
            v-if="item.user.account !== formModel.account && item.isFollow"
            style="
              background-color: #7f7f7f;
              border: 1px solid;
              cursor: pointer;
              padding: 1px;
              color: #fff;
            "
          >
            <span style="margin-left: 1px">已关注</span>
          </button>
        </div>

        <div>{{ item.createTime }}</div>
      </div>
      <el-button
        type="danger"
        @click="deleteDynamics(item)"
        style="margin-left: auto; margin-right: 50px; padding: 5px"
        >删除</el-button
      >
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
