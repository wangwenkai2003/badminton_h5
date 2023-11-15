import request from '@/utils/request'
export default {
  getSitesBysiteType: function (data) {
    return request.get(
      'reservationSite/getReserveInfoBySiteType?siteType=' + data
    )
  }
}
