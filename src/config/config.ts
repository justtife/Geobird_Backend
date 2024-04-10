const mainConfig: Record<string, Record<string, string | Buffer | number | Boolean | Record<string, string | number | Boolean | Record<string, string | number>>>> = {
    development: {
        APP_ENV: process.env.APP_ENV as string,
        SERVICE: "userservice",
        DB: {
            uri: process.env.uri as string,
            pool: {
                maxPoolSize: (process.env.PoolSize || 10) as number,
            },
        },
        JWT_SECRET: process.env.JWT_SECRET as string,
        SESSION_SECRET: process.env.SESSION_SECRET as string,
        COOKIE_SECRET: process.env.COOKIE_SECRET as string,
    },
    production: {
    },
    test: {
        APP_ENV: process.env.APP_ENV as string,
        SERVICE: "userservice",
        DB: {
            uri: process.env.TEST_uri as string,
            pool: {
                maxPoolSize: (process.env.PoolSize || 10) as number,
            },
        },
        JWT_SECRET: process.env.JWT_SECRET as string,
        SESSION_SECRET: process.env.SESSION_SECRET as string,
        COOKIE_SECRET: process.env.COOKIE_SECRET as string,
    },
};
const env: Record<string, any> = mainConfig[process.env.APP_ENV as string] || mainConfig["development"];
export default env;