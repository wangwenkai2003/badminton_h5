<script setup>
import { useUserStore } from '@/stores/user.js'
import { onMounted, ref } from 'vue'
import user from '@/api/user.js'
import { ElMessage } from 'element-plus'

const formModel = ref({
  oldPassword: '',
  newPassword: '',
  repassword: '',
  password: '',
  account: ''
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
  if (formModel.value.oldPassword !== formModel.value.password) {
    ElMessage.error('旧密码错误')
    return
  }
  formModel.value.password = formModel.value.newPassword
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
// 规则
const rules = {
  account: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 10, message: '用户名必须是5-10位的字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15位的非空字符',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15位的非空字符',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.newPassword) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}
</script>
<template>
  <div style="padding: 10px">
    <el-form
      ref="form"
      size="large"
      autocomplete="off"
      :model="formModel"
      :rules="rules"
    >
      <el-form-item prop="password">
        <h4>旧密码</h4>
        <el-input v-model="formModel.oldPassword" type="password"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <h4>新密码</h4>
        <el-input v-model="formModel.newPassword" type="password"></el-input>
      </el-form-item>
      <el-form-item prop="repassword">
        <h4>确认新密码</h4>
        <el-input v-model="formModel.repassword" type="password"></el-input>
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
