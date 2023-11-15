<script setup>
import { useUserStore } from '@/stores/user.js'
import { onMounted, ref } from 'vue'

import DynamcisForm from './DynamcisForm.vue'

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
})
</script>
<template>
  <div>
    <DynamcisForm style="margin-top: 5px"></DynamcisForm>
    <!-- <DynamcisCard></DynamcisCard> -->
  </div>
</template>
