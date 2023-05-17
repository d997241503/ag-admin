import fetch from 'utils/fetch';
import {getToken} from 'utils/auth'

export function toFormData(params) {
    const formData = new FormData()
    if (!params) {
      return formData
    }
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(val => {
          formData.append(key, val)
        })
      } else {
        formData.set(key, value)
      }
    })
    return formData
}

export function uploadFile(data, buckketName) {
    return fetch({
        url: `/api/upload/uploads/uploadFile?token=${getToken()}&bucketName=${buckketName}`,
        method: 'post',
        data: toFormData(data)
    })
}