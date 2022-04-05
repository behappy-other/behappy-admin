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

  async saveOrUpdate (param) {
    return req(urlPrefix, 'post', {}, param)
  }
}

export default new ProdService()
