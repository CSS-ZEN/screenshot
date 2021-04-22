
import AWS from 'aws-sdk'
import { S3, BUCKET } from './awss3'

export default async function uploadAws (fileName: string, fileBuffer: Buffer) {
    const params = {
        Bucket: BUCKET,
        Key: fileName,
        Body: fileBuffer,
    } as AWS.S3.PutObjectRequest

    S3.upload(params, (error, data) => {
        // extra handle
        if (error) {
            return {
                status: 'error',
                error: error.message || 'Something went wrong',
            }
        }
        return {
            status: 'ok',
            data,
        }
    })
}