import request from '@/utils/request'
export default {
  save: function (data) {
    return request.post('notice/save', data)
  },
  getLimit: function () {
    return request.get('notice/getNoticeLimit')
  },
  updateNotice: function (data) {
    return request.put('notice/updateNotice', data)
  }
}
