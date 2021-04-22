// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from 'next'
import { getUrl, genScreenshot, uploadAwsS3, DeviceModel } from 'src/helpers'
export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { url, filename, mode = 'desktop' } = req.body
    let { width, height } = req.body
    width = width ? Number(width) : null
    height = height ? Number(height) : null
    setTimeout(async () => {
        const fileBuffer = await genScreenshot(url, { mode, width, height })
        if (!fileBuffer) return
        const result = await uploadAwsS3(filename, fileBuffer)
    }, 0)
    res.json({})
    return res.end()
}