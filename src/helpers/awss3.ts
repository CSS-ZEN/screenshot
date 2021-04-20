import AWS from 'aws-sdk'
import { REGION, BUCKET } from 'src/config'
import Config from 'src/config'

const S3 = new AWS.S3({
    region: REGION,
    credentials: {
        accessKeyId: Config.ACCESS_KEY_ID,
        secretAccessKey: Config.SCERET_ACCESS_KEY
    }
})

export async function getUrl(fileName: string): Promise<string> {
    const params = {
        Bucket: BUCKET,
        Key: fileName,
        Expires: 60
    }
    const signedURL = S3.getSignedUrl('getObject', params)
    return signedURL
}
export { S3, BUCKET }