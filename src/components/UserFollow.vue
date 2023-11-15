<script setup>
import { useUserStore } from '@/stores/user.js'
import { onMounted, ref } from 'vue'
import user from '@/api/user.js'
import router from '@/router'

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
    getMyFollow(formModel.value.account)
  }
})
//关注列表
let followList = ref([])
//获取关注列表
const getMyFollow = (account) => {
  user.getMyFollow(account).then((res) => {
    console.log(res, 'userfollow')
    if (
      res.data.data !== null &&
      res.data.data !== undefined &&
      res.data.data.length > 0
    ) {
      console.log(res.data.data, 'followList')
      followList.value = res.data.data
    } else {
      followList.value = []
    }
  })
}
//关注表单
const followForm = ref({
  befollowUserAccount: '',
  followUserAccount: ''
})
// 取消关注
const cancelFollow = async (item) => {
  await ElMessageBox.confirm('您确定取消关注吗', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  followForm.value.befollowUserAccount = item.account
  followForm.value.followUserAccount = formModel.value.account
  user.cancelFollow(followForm.value).then((res) => {
    if (res.data.code === 1) {
      console.log('xxxxx')
      getMyFollow(formModel.value.account)
    }
  })
}
</script>
<template>
  <div style="padding: 5px; display: flex; flex-wrap: wrap">
    <div v-for="item in followList" :key="item" style="width: 15%">
      <div
        style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        "
      >
        <el-avatar :size="50" :src="item.avatar" />
        <div>
          <span style="color: #4e8ac4">{{ item.name }}</span>
        </div>
        <div>
          <button
            @click="cancelFollow(item)"
            style="
              background-color: #3f9dfd;
              color: #fff;
              border: 1px solid #f4f4f4;
              border-radius: 5px;
              padding: 5px;
              cursor: pointer;
            "
          >
            取消关注
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
