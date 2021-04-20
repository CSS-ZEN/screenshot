// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from 'next'
import { genScreenshot } from 'src/helpers'
import { IQuery } from '../desktop/[name]'
export default async (req: NextApiRequest, res: NextApiResponse) => {
    let { url, width, height } = req.query as IQuery
    width = width ? Number(width) : null
    height = height ? Number(height) : null
    if (!url) {
        res.status(400)
        return res.end()
    }

    const fileBuffer = await genScreenshot(url, { mode: 'mobile', width, height })
    res.setHeader("Content-Type", 'image/jpg')
    res.send(fileBuffer)
}