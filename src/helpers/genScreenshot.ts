import chromium from 'chrome-aws-lambda'
import puppeteerLib from 'puppeteer'

export type DeviceModel = 'mobile' | 'desktop'

export type IScreenShotOptions = {
    mode?: DeviceModel,
    width?: number,
    height?: number,
}

async function getPuppeteerExcutable() {
    // return puppeteerLib
    const cal = await chromium.executablePath
    if (!cal) return puppeteerLib
    return chromium.puppeteer
}

async function getDevice(brand = 'iPhone X') {
    const puppeteer = await getPuppeteerExcutable()
    return puppeteer.devices[brand]
}

async function injectionStyle() {
    if (document && document.createElement && document.body) {
        var style = document.createElement('style')
        style.innerHTML = '* { -webkit-transition: font-size 0.01s !important; -webkit-animation-delay: 0.01s !important; -webkit-animation-duration: 0.01s !important;}'
        document.head.appendChild(style)
    }
}


export async function getBrowserInstance(width?: number, height?: number) {
    // 1280, 720
    const puppeteer = await getPuppeteerExcutable()
    const browser = puppeteer.launch({
        args: chromium.args,
        // args: ["--screenshot", "--virtual-time-budget=25000"],
        headless: true,
        // defaultViewport: {
        //     width: width || ,
        //     height: height || 720
        // },
        executablePath: await chromium.executablePath || undefined,
        ignoreHTTPSErrors: true
    })
    return browser
}

export default async function genScreenshot(url: string, options: IScreenShotOptions): Promise<Buffer | undefined> {
    console.time("screenshot")
    const browser = await getBrowserInstance(options.width, options.height)

    try {
        let page = await browser.newPage()
        // let brand = 'iPad landscape'
        const brand = 'iPad'
        const device = await getDevice(brand)
        device.userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36"
        if (options.mode == 'mobile') {
            device.viewport.width = options.width || 375
            device.viewport.height = options.height || 812
        } else {
            device.viewport.width = options.width || 1280
            device.viewport.height = options.height || 720
        }
        await page.emulate(device)

        await Promise.race([
            page.goto(url, { waitUntil: 'networkidle0' }),
            new Promise((resolve) => setTimeout(resolve, 10 * 1000))
        ])
        await new Promise((resolve) => setTimeout(resolve, 100))
        await page.evaluate(injectionStyle)
        const imageBuffer = await page.screenshot({
            clip: {
                x: 0,
                y: 0,
                width: device.viewport.width,
                height: device.viewport.height,
            }
            // fullPage: true
        }) as Buffer

        return imageBuffer
    } catch (error) {
        console.log(error)
        return
        // return callback(error);
    } finally {
        await browser.close()
        console.timeEnd("screenshot")
    }
}