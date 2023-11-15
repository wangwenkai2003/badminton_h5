<script setup>
import { useUserStore } from '@/stores/user.js'
import { onMounted, ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import reserve from '../api/reserve'

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
  changeType()
})

const campus = ref([
  { value: 0, label: '东校区' },
  { value: 1, label: '西校区' },
  { value: 2, label: '武汉校区' }
])

let currentCampus = ref(0)

const changeCampus = () => {
  changeType()
}

const reserveData = ref([])
//获取长度预约信息
const getBySiteType = () => {
  reserve.getSitesBysiteType(currentCampus.value).then((res) => {
    reserveData.value = res.data.data
  })
}

let currentType = ref(0)

const reserveType = ref([
  { value: 0, label: '当天预约' },
  { value: 1, label: '历史记录' }
])

const changeType = () => {
  console.log(currentType.value)
  if (currentType.value === 0) {
    getTodayReserve()
  }
  if (currentType.value === 1) {
    getBySiteType()
  }
}
//获取今天预约信息
const getTodayReserve = () => {
  reserve.getSitesBysiteType(currentCampus.value).then((res) => {
    reserveData.value = res.data.data
    console.log(res.data.data)
    reserveData.value = reserveData.value.filter((item) => {
      const endTime = item.endTime.slice(0, 10) // 提取日期部分
      return compareDate(endTime) // 日期比较
    })
  })
}
//比较是否为今天
const compareDate = (endTime) => {
  const date = endTime.slice(0, 10)

  // 获取当前日期
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth() + 1 // 月份从 0 到 11 编号，所以需要加 1
  const currentDay = today.getDate()

  // 获取判断日期的年、月、日
  const year = parseInt(date.slice(0, 4))
  const month = parseInt(date.slice(5, 7))
  const day = parseInt(date.slice(8, 10))

  // 比较年、月、日是否与当前日期相等
  const isToday =
    year === currentYear && month === currentMonth && day === currentDay
  return isToday
}
//查看预约细节
const handleView = (row) => {
  console.log(row)
}
</script>
<template>
  <div style="padding: 10px; height: 100%">
    <div style="display: flex; justify-content: space-between">
      <el-select
        v-model="currentCampus"
        class="m-2"
        placeholder="选择场地"
        size="large"
        @change="changeCampus"
      >
        <el-option
          v-for="item in campus"
          style="padding: 2px"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="currentType"
        class="m-2"
        placeholder="选择场地"
        size="large"
        @change="changeType"
      >
        <el-option
          v-for="item in reserveType"
          style="padding: 2px"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>

    <el-table :data="reserveData" style="width: 100%">
      <el-table-column prop="siteName" label="名称" width="180" />
      <el-table-column prop="siteAddress" label="地址" width="180" />
      <el-table-column prop="startTime" label="开始时间" width="180" />
      <el-table-column prop="endTime" label="结束时间" width="180" />
      <el-table-column prop="reserveUserAccount" label="预约人学号" />
    </el-table>
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
