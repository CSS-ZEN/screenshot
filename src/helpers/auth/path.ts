
import { IncomingMessage } from 'http'

export const pathInRequest = (paths: string[], req: IncomingMessage) => {
    const path = req.url
    if (!path) {
        console.log('request url is undefined')
        return false
    }
    return paths.some(item => path.startsWith(item))
}