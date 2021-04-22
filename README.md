# screenshot

Puppeteer screenshot service with Next.js

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
