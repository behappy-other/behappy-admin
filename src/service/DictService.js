import req from '@/utils/request'

const urlPrefix = '/behappy-system/web/v1/dict'

class DictService {
  async icons () {
    return req(urlPrefix, 'get', {
      type: 'icon'
    })
  }
}

export default new DictService()
