import req from '@/utils/request'

const urlPrefix = '/behappy-system/web/v1/menu'

class MenuService {
  async menus (params) {
    return req(urlPrefix, 'get', params)
  }

  async save (form) {
    return req(urlPrefix, 'post', {}, form)
  }

  async del (param) {
    return req(urlPrefix, 'delete', {}, param)
  }

  async menuIds () {
    return req(urlPrefix + '/ids', 'get')
  }
}

export default new MenuService()
