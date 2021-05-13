
import AWS from 'aws-sdk'
import { S3, BUCKET } from './awss3'


export default async function uploadAws(fileName: string, fileBuffer: Buffer) {
    const params: AWS.S3.PutObjectRequest = {
        Bucket: BUCKET,
        Key: fileName,
        Body: fileBuffer,
        ContentType: 'image/jpeg',
    }

    S3.upload(params, (error, data) => {
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
