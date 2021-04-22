
import AWS from 'aws-sdk'
import CONFIG from 'src/config'


export const {BUCKET} = CONFIG

export const S3 = new AWS.S3({
    region: CONFIG.REGION,
    credentials: {
        accessKeyId: CONFIG.ACCESS_KEY_ID,
        secretAccessKey: CONFIG.SCERET_ACCESS_KEY,
    },
})

export async function getUrl (fileName: string): Promise<string> {
    const params = {
        Bucket: CONFIG.BUCKET,
        Key: fileName,
        Expires: 60,
    }
    const signedURL = S3.getSignedUrl('getObject', params)
    return signedURL
}
