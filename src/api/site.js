import request from '@/utils/request'
export default {
  getSites: function (data) {
    return request.get('site/getSites?siteType=' + data)
  },
  saveSite: function (data) {
    return request.post('site/saveSite', data)
  },
  deleteSite: function (data) {
    return request.delete('site/deleteSite?id=' + data)
  }
}
