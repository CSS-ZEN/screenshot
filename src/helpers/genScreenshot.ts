
// tslint:disable: no-magic-numbers

import chromium from 'chrome-aws-lambda'
import puppeteerLib from 'puppeteer'

import CONFIG from 'src/config'


export type DeviceModel = 'mobile' | 'desktop'

export type IScreenShotOptions = {
    mode?: DeviceModel,
    width?: number,
    height?: number,
}

async function getPuppeteerExcutable () {
    const cal = await chromium.executablePath
    if (!cal) return puppeteerLib
    return chromium.puppeteer
}

async function getDevice (options: IScreenShotOptions) {
    const puppeteer = await getPuppeteerExcutable()
    const brand = 'iPad'
    const device = puppeteer.devices[brand]
    device.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36'
    if (options.mode === 'mobile') {
        device.viewport.width = options.width || 375
        device.viewport.height = options.height || 812
    } else {
        device.viewport.width = options.width || 1280
        device.viewport.height = options.height || 720
    }

    return device
}

async function injectStyle (style: string) {
    if (document && document.createElement && document.body) {
        const $style = document.createElement('style')
        $style.innerHTML = style
        document.head.appendChild($style)
    }
}

async function sleep (ms: number = 0) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function until<T> (p: Promise<T>, ms: number): Promise<T | unknown> {
    return Promise.race([p, new Promise(resolve => setTimeout(resolve, ms))])
}

export async function getBrowserInstance () {
    const puppeteer = await getPuppeteerExcutable()
    const browser = puppeteer.launch({
        args: chromium.args,
        // args: ["--screenshot", "--virtual-time-budget=25000"],
        headless: true,
        executablePath: await chromium.executablePath || CONFIG.CHROMIUM_EXECUTABLE,
        ignoreHTTPSErrors: true,
    })
    return browser
}

export default async function genScreenshot (url: string, options: IScreenShotOptions): Promise<Buffer | undefined> {
    console.time('screenshot')
    const browser = await getBrowserInstance()

    try {
        const page = await browser.newPage()
        const device = await getDevice(options)
        await page.emulate(device)

        await until(page.goto(url, {waitUntil: 'networkidle0'}), 5 * 1000)
        await page.evaluate(injectStyle, `*, *::after, *::before {
            transition-delay: 0s !important;
            transition-duration: 0s !important;
            animation-delay: -0.0001s !important;
            animation-duration: 0s !important;
            animation-play-state: paused !important;
            caret-color: transparent !important;
            color-adjust: exact !important;
        }`)
        await sleep(100)
        const imageBuffer = await page.screenshot({
            clip: {
                x: 0,
                y: 0,
                width: device.viewport.width,
                height: device.viewport.height,
            },
            // fullPage: true
        }) as Buffer

        return imageBuffer
    } catch (error) {
        console.error(error)
    } finally {
        await browser.close()
        console.timeEnd('screenshot')
    }
}
