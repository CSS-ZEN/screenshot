
import genScreenshot, {IScreenShotOptions} from './genScreenshot'
import uploadAwsS3 from './uploadAws'
import RequestQueue from './queue'


interface IRequestOptions extends IScreenShotOptions {
    url: string
    filename: string
}

async function handle (options: IRequestOptions) {
    const {url, filename, mode, width, height} = options
    const fileBuffer = await genScreenshot(url, {mode, width, height})
    if (!fileBuffer) return
    await uploadAwsS3(filename, fileBuffer)
}

export default new RequestQueue({
    maxLimit: 1,
    requestApi: handle,
    needChange2Promise: false,
})
