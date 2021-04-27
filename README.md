# screenshot

Puppeteer screenshot service with Next.js

## Auth

Server environment variable

```
# Multiple accounts with `|` as a delimiter
BASIC_AUTH_CREDENTIALS=test:test2|admin:admin
```

Client

```js
const username = 'admin'
const password = 'admin'

const { ok, status } = await fetch('http://localhost:3000/api/snapshot/desktop?url=https://czg.vercel.app', {
    headers: {
        Authorization: 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64')
    }
})
```

## Local development instructions for Apple Silicon

For Apple Silicon/M1, you may need to add this before install the requirements.

```bash
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_EXECUTABLE_PATH=`which chromium`
```

And add this in `.env.local`

```bash
CHROMIUM_EXECUTABLE=/Applications/Chromium.app/Contents/MacOS/Chromium
```

If it complains about absence of `vips/vips8`, you may need to install `brew install libvips` and reinstall the requirements.
