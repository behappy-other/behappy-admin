import req from '@/utils/request'

const urlPrefix = '/behappy-system/web/v1/role-menu'

class RoleService {
  async setRoleMenu (roleId, params) {
    return req(urlPrefix + '/' + roleId, 'post', {}, params)
  }

  async getRoleMenu (roleId) {
    return req(urlPrefix + '/' + roleId)
  }
}

export default new RoleService()
