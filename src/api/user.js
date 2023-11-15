import request from '@/utils/request'
export default {
  loginService: function (data) {
    return request.post('user/login', data)
  },
  registerService: function (data) {
    return request.post('/user/register', data)
  },
  updateService: function (data) {
    return request.put('/user/update', data)
  },
  imgService: function (data) {
    console.log(data._rawValue, 'fileform')
    return request.post('/img/upload', data._rawValue)
  },
  getMyFollow: function (data) {
    return request.get('/follow/getMyFollow?userAccount=' + data)
  },
  saveFollow: function (data) {
    return request.post('/follow/saveFollow', data)
  },
  cancelFollow: function (data) {
    return request.delete('/follow/deleteFollow', { data: data })
  }
}
