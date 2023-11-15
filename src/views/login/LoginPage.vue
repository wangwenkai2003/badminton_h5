<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref } from 'vue'
import user from '@/api/user.js'
import { useUserStore } from '@/stores/user.js'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const isRegister = ref(false)
const formModel = ref({
  account: '',
  password: '',
  repassword: ''
})
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
        if (value !== formModel.value.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// const register = async () => {
//   await form.value.validate()
// }
const router = useRouter()
const userStore = useUserStore()
const login = async () => {
  // await form.value.validate()
  const resp = await user.loginService(formModel.value)
  // console.log(resp)
  console.log(resp.data.data, 'res')
  userStore.setToken(resp.data.data.token)
  userStore.setUser(resp.data.data)
  ElMessage.success('登录成功')
  router.push('/')
}
</script>

<template>
  <el-row class="login-page" style="background-color: #2d3352; color: #f4f4f4">
    <el-col :span="12" class="bg">
      <div class="bgi"></div>
    </el-col>
    <el-col :span="6" :offset="3" class="form">
      <el-form
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
        :model="formModel"
        :rules="rules"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="account">
          <el-input
            v-model="formModel.account"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            :prefix-icon="Lock"
            type="password"
            v-model="formModel.password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            :prefix-icon="Lock"
            type="password"
            v-model="formModel.repassword"
            placeholder="请再次输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex" style="display: flex; width: 100%">
            <el-checkbox>记住我</el-checkbox>
            <el-link style="margin-left: auto" type="primary" :underline="false"
              >忘记密码?</el-link
            >
          </div>
        </el-form-item>
        <el-form-item style="display: flex; width: 100%">
          <el-button
            style="margin-left: auto; margin-right: auto"
            class="button"
            type="primary"
            auto-insert-space
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>

      <!-- 登录相关表单 -->
      <el-form
        ref="form"
        :model="formModel"
        size="large"
        autocomplete="off"
        :rules="rules"
        v-else
      >
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="account">
          <el-input
            v-model="formModel.account"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            :prefix-icon="Lock"
            type="password"
            v-model="formModel.password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            class="button"
            type="primary"
            auto-insert-space
            @click="login"
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link :underline="false" @click="isRegister = true"
            >注册 -></el-link
          >
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    // background-image: url('@/assets/badmintonIndex.png');
    background-color: #45bc8f;
    .bgi {
      width: 100%;
      height: 80%;
      background-size: 100% 100%;
      background-image: url('@/assets/badmintonIndex.png');
    }
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
  }
  .flex {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .button {
    width: 100%;
  }
}
</style>
