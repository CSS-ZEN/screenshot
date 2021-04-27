
import type {NextApiRequest, NextApiResponse} from 'next'

import genScreenshot, {IScreenShotOptions, DeviceModel} from './genScreenshot'
import HTTPStatusCodes from './statusCode'
import uploadAws from './uploadAws'
import basicAuthMiddleware from './auth'

interface ISnapshotOptions extends IScreenShotOptions {
    url: string
    key?: string
}

/**
 * @description If key is absent, note that search params will be ignored.
 */
function generateKey (options: ISnapshotOptions) {
    const {url, key, mode = ''} = options
    if (key) return key

    const modePrefix = mode && `${mode}/`
    const {pathname, hostname} = new URL(url)
    if (pathname && pathname !== '/') return `${modePrefix}${hostname}/${pathname}.jpg`
    return `${modePrefix}${hostname}.jpg`
}

export default async function snapshot (options: ISnapshotOptions) {
    const {url} = options

    const fileBuffer = await genScreenshot(url, options)
    if (fileBuffer) await uploadAws(generateKey(options), fileBuffer)

    return fileBuffer
}

export function snapshotHandler (mode: DeviceModel) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const {ok, result} = await basicAuthMiddleware(req, res)
        if (!ok) return result

        const {url, width, height} = req.query
        if (!url || Array.isArray(url)) {
            res.status(HTTPStatusCodes.BAD_REQUEST)
            return res.end()
        }

        const fileBuffer = await snapshot({
            url,
            mode,
            width: Number(width),
            height: Number(height),
        })

        res.setHeader('Content-Type', 'image/jpg')
        return res.send(fileBuffer)
    }
}
