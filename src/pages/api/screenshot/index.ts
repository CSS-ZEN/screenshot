// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from 'next'
import requestInstance from 'src/helpers/uploadAwsQueue'
export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { url, filename, mode = 'desktop' } = req.body
    let { width, height } = req.body
    width = width ? Number(width) : null
    height = height ? Number(height) : null
    requestInstance.request({
        url,
        filename,
        mode,
        width,
        height,
    })
    res.json({})
    return res.end()
}