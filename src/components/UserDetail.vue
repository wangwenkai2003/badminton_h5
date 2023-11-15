<script setup>
import { useUserStore } from '@/stores/user.js'
import { onMounted, ref } from 'vue'
import user from '@/api/user.js'
import { ElMessage } from 'element-plus'

const formModel = ref({
  id: '',
  name: '',
  QQ: '',
  email: '',
  sex: '',
  birthday: '',
  college: ''
})

let isLogin = ref(false)
onMounted(() => {
  const userStore = useUserStore()
  const { user } = userStore
  if (user.id !== '' && user.id !== undefined) {
    formModel.value = user
    isLogin.value = true
  }
})
// 提交修改
const sumbit = () => {
  const result = user.updateService(formModel.value)
  result.then((res) => {
    if (res.data.code === 1) {
      const userStore = useUserStore()
      formModel.value = res.data.data
      userStore.setUser(formModel.value)
      ElMessageBox.alert('修改成功', {
        type: 'success',
        confirmButtonText: '确认'
      })
    }
  })
}
</script>
<template>
  <div style="padding: 10px">
    <el-form ref="form" size="large" autocomplete="off" :model="formModel">
      <el-form-item>
        <h4>姓名</h4>
        <el-input disabled v-model="formModel.name"></el-input>
      </el-form-item>
      <div><h5 style="margin-top: 10px">性别</h5></div>
      <el-form-item>
        <el-radio-group v-model="formModel.sex">
          <el-radio label="1" size="large" value="0" style="margin-right: 10px"
            >男</el-radio
          >
          <el-radio label="2" size="large" value="1">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <h4>学院</h4>
        <el-input v-model="formModel.college" disabled></el-input>
      </el-form-item>
      <el-form-item>
        <h4>邮箱</h4>
        <el-input
          v-model="formModel.email"
          placeholder="请输入邮箱号"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <h4>QQ</h4>
        <el-input v-model="formModel.qq" placeholder="请输入QQ号"></el-input>
      </el-form-item>
    </el-form>
    <el-form-item style="width: 100%">
      <el-button
        style="
          width: 20%;
          margin-left: auto;
          margin-right: auto;
          margin-top: 10px;
        "
        class="button"
        type="primary"
        auto-insert-space
        @click="sumbit"
        >提交</el-button
      >
    </el-form-item>
  </div>
</template>
<style scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
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
</style>
