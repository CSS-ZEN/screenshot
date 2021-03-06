
class Config {
    public get ACCESS_KEY_ID () {return readEssentialValue('ACCESS_KEY_ID')}

    public get SCERET_ACCESS_KEY () {return readEssentialValue('SCERET_ACCESS_KEY')}

    public get REGION () {return readOptionalValue('REGION')}

    public get BUCKET () {return readEssentialValue('BUCKET')}

    public get CHROMIUM_EXECUTABLE () {return readOptionalValue('CHROMIUM_EXECUTABLE')}

    public get AWS_S3_EXPIRE_LIFTIME () {return readOptionalValue('AWS_S3_EXPIRE_LIFTIME', '60')}

    public get NEXT_AWSHOST () {return readOptionalValue('NEXT_AWSHOST')}

    public get BASIC_AUTH_CREDENTIALS () {return readOptionalValue('BASIC_AUTH_CREDENTIALS', '')}
}

function readOptionalValue (key: string): string | undefined
function readOptionalValue (key: string, fallback: string): string
function readOptionalValue (key: string, fallback?: string) {
    const value = process.env[key]
    if (value === undefined) return fallback

    return value
}

function readEssentialValue (key: string) {
    const value = process.env[key]
    if (value === undefined) throw new Error(`Essential config ${key} unavailable`)

    return value
}

export default new Config()
