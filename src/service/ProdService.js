import req from '@/utils/request'

const urlPrefix = '/behappy-product/web/v1/prod'

class ProdService {
  async page (params) {
    return req(urlPrefix + '/page', 'get', params)
  }

  async del (param) {
    return req(urlPrefix, 'delete', param)
  }

  async info (prodId) {
    return req(urlPrefix + `/info/${prodId}`)
  }
}

export default new ProdService()
