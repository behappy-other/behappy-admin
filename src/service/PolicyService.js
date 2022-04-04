import req from '@/utils/request'

const urlPrefix = '/behappy-thirdparty/web/v1/oss'

class PolicyService {
  async policy () {
    return new Promise((resolve, reject) => {
      req(urlPrefix + '/policy', 'get').then(data => resolve(data))
    })
  }
}

export default new PolicyService()
