import {getToken} from './auth' 
import {formatFile as _formatFile} from './index'

export function downloadFile(fileUrl, bucketName) {
    window.location.href = `/api/upload/download/downloadFileByBucketName?fileUrl=${fileUrl}&token=${getToken()}&bucketName=${bucketName}`
}
export const formatFile = _formatFile