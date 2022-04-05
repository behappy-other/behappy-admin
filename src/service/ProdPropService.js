import req from '@/utils/request'

const urlPrefix = '/behappy-product/web/v1/spec'

class ProdPropService {
  async page (params) {
    return req(urlPrefix + '/page', 'get', params)
  }

  async del (param) {
    return req(urlPrefix, 'delete', {}, param)
  }

  async save (param) {
    return req(urlPrefix, 'post', {}, param)
  }

  async list () {
    return req(urlPrefix + '/list')
  }

  async listSpecValue (propId) {
    return req(urlPrefix + `/spec-value/${propId}`)
  }
}

export default new ProdPropService()
