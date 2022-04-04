import req from '@/utils/request'

const urlPrefix = '/behappy-product/web/v1/category'

class CategoryService {
  async load (params) {
    return req(urlPrefix, 'get', params)
  }

  async del (ids) {
    return req(urlPrefix, 'delete', {}, ids)
  }

  async save (param) {
    return req(urlPrefix, 'post', {}, param)
  }
}

export default new CategoryService()
