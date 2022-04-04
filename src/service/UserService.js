import req from '@/utils/request'

const urlPrefix = '/behappy-system/web/v1/user'

class UserService {
  async password (params) {
    return req(urlPrefix + '/password', 'post', {}, params)
  }

  async username (params) {
    return req(urlPrefix + '/username', 'get', params)
  }

  async login (params) {
    return req(urlPrefix + '/login', 'post', {}, params)
  }

  async load (params) {
    return req(urlPrefix + '/page', 'get', params)
  }

  async save (params) {
    return req(urlPrefix, 'post', {}, params)
  }

  // 传数组进行删除
  async del (ids) {
    return req(urlPrefix, 'delete', {}, ids)
  }
}

export default new UserService()
