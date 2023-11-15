<script setup>
import { useUserStore } from '@/stores/user.js'
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import siteService from '@/api/site.js'

const formModel = ref({
  id: '',
  name: '',
  QQ: '',
  email: '',
  sex: '',
  birthday: '',
  college: ''
})
let currentCampus = ref(0)
let isLogin = ref(false)
onMounted(() => {
  const userStore = useUserStore()
  const { user } = userStore
  if (user.id !== '' && user.id !== undefined) {
    formModel.value = user
    isLogin.value = true
  }
  getSites()
})
//获取站点信息
const getSites = () => {
  siteService.getSites(currentCampus.value).then((res) => {
    console.log(res.data.data)
    SiteData.value = res.data.data
  })
}
//新增站点
//站点表单
let siteForm = ref({
  id: '',
  siteName: '',
  siteAddress: '',
  siteType: currentCampus.value,
  isReserve: '0',
  ifReservation: 1
})
//站点信息
const campus = ref([
  { value: 0, label: '东校区' },
  { value: 1, label: '西校区' },
  { value: 2, label: '武汉校区' }
])

const changeCampus = () => {
  siteForm.value.siteType = currentCampus.value
  getSites()
}
const formatReserve = (row) => {
  return row.isReserve === 0 ? '是' : '否'
}
let SiteData = ref([])
let isAdd = ref(false)
//新增站点
const addSite = () => {
  siteForm.value.siteName = ''
  siteForm.value.siteAddress = ''
  isAdd.value = true
}
//提交站点信息
const submitForm = () => {
  if (siteForm.value.siteName === '' || siteForm.value.siteAddress === '') {
    return ElMessage.error('请填写完整场地信息')
  }
  siteService.saveSite(siteForm.value).then((res) => {
    console.log(res.data, 'res')
    if (res.data.code === 1) {
      siteForm.value.siteName = ''
      siteForm.value.siteAddress = ''
      isAdd.value = false
      getSites()
      ElMessage.success(res.data.data)
    }
  })
}
//站点校验
// const rules = {
//   name: [{ required: true, message: '站点名称不能为空', trigger: 'blur' }],
//   address: [{ required: true, message: '站点地址不能为空', trigger: 'blur' }]
// }
//取消保存站点信息
const cancelForm = () => {
  isAdd.value = false
}
//修改站点信息
const editSite = (row) => {
  siteForm.value = row
  isAdd.value = true
}
// 删除场地信息
const deleteSite = async (row) => {
  await ElMessageBox.confirm('您确定删除吗', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  console.log(row, 'row')
  siteService.deleteSite(row.id).then((res) => {
    if (res.data.code === 1) {
      getSites()
      ElMessage.success(res.data.data)
    }
  })
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
      <el-button
        type="primary"
        style="padding: 10px; margin-right: 70px"
        @click="addSite"
        >添加</el-button
      >
    </div>

    <el-table :data="SiteData" style="width: 100%">
      <el-table-column prop="id" show-header="false" label="id" width="180" />
      <el-table-column prop="siteName" label="名称" width="180" />
      <el-table-column prop="siteAddress" label="地址" width="180" />
      <el-table-column
        prop="isReserve"
        label="是否可预约"
        :formatter="formatReserve"
      />
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="editSite(row)"
            >编辑</el-button
          >
          <el-button link type="danger" size="small" @click="deleteSite(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-form
      v-if="isAdd"
      label-width="100px"
      :model="siteForm"
      style="max-width: 460px"
      class="addSite"
    >
      <el-form-item prop="name" label="站点名称">
        <el-input v-model="siteForm.siteName" />
      </el-form-item>
      <el-form-item prop="address" label="站点地址">
        <el-input v-model="siteForm.siteAddress" />
      </el-form-item>
      <el-form-item label="是否可预约">
        <el-radio-group v-model="siteForm.isReserve" class="ml-4">
          <el-radio label="0" size="large">是</el-radio>
          <el-radio style="margin-left: 10px" label="1" size="large"
            >否</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item style="display: flex">
        <el-button type="primary" style="padding: 5px" @click="submitForm"
          >提交</el-button
        >
        <el-button style="padding: 5px" @click="cancelForm">取消</el-button>
      </el-form-item>
    </el-form>
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
.addSite {
  position: absolute;
  left: 40%;
  top: 40%;
  height: 20vh;
  padding: 40px;
  background-color: #ecf5ff;
  z-index: 100;
}
</style>
