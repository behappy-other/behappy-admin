import req from '@/utils/request'

const urlPrefix = '/behappy-system/web/v1/role'

class RoleService {
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

  // 查询全部role
  async roles () {
    return req(urlPrefix + '/list', 'get')
  }
}

export default new RoleService()
