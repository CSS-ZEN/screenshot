import genScreenshot from './genScreenshot'
import uploadAwsS3 from './uploadAws'
import RequestQueue from './queue'
import { IScreenShotOptions } from './index'
interface IRequestOptions extends IScreenShotOptions {
    url: string;
    filename: string;
}

async function handle(options: IRequestOptions) {
    const { url, filename, mode, width, height } = options
    const fileBuffer = await genScreenshot(url, { mode, width, height })
    if (!fileBuffer) return
    await uploadAwsS3(filename, fileBuffer)
}

const requestInstance = new RequestQueue({
    maxLimit: 1,
    requestApi: handle,
    needChange2Promise: false,
});

export default requestInstance