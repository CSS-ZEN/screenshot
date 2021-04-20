export const REGION = process.env.REGION
export const BUCKET = process.env.BUCKET
export const NEXT_AWSHOST = process.env.NEXT_AWSHOST

type IConfig<TSetting extends IConfigSettings> = {
    [key in keyof TSetting]: TSetting[key] extends IOptionalConfigSetting ? (string | undefined) : string
}

interface IConfigSettingBase { }
interface IOptionalConfigSetting extends IConfigSettingBase {
    optional: true
}

type IConfigSetting = IConfigSettingBase | IOptionalConfigSetting

type IConfigSettings = Record<string, IConfigSetting>

class Config {
    public constructor(private config: IConfigSettings) {
        this.setUpSettings()
    }

    private setUpSettings() {
        for (const key in this.config) {
            Object.defineProperty(this, key, {
                get: () => {
                    return this.readValue(key)
                }
            })
        }
    }

    private readValue(key: string) {
        if (this.isOptional(this.config[key])) return this.readOptionalValue(key)
        return this.readEssentialValue(key)
    }

    private isOptional(configSetting: IConfigSetting): configSetting is IOptionalConfigSetting {
        return !!(configSetting as any || {}).optional
    }

    private readOptionalValue(key: string) {
        return process.env[key]
    }

    private readEssentialValue(key: string) {
        const value = process.env[key]
        if (value === undefined) throw new Error(`Essential config ${key} unavailable`)

        return value
    }
}

const genConfig: <TSettings extends IConfigSettings>(settings: TSettings) => IConfig<TSettings> = settings => new Config(settings) as any

export default genConfig({
    ACCESS_KEY_ID: {},
    SCERET_ACCESS_KEY: {},
    NEXT_HOST: { optional: true }
})