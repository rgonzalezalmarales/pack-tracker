export enum Env {
  Enviroment = 'enviroment',
  MongoDB = 'mongodb',
  Port = 'port',
  DefaultLimit = 'defaultLimit',
  JwtSecret = 'JwtSecret',
  EmailServer = 'EmailServer',
  EmailPort = 'EmailPort',
  EmailSecure = 'EmailSecure',
  EmailUser = 'EmailUser',
  EmailPassword = 'EmailPassword',
  EmailFrom = 'EmailFrom',
  LinkStatus = 'LinkStatus',
}

export const EnvConfig = () => ({
  enviroment: process.env.MODE_ENV || 'DEV',
  mongodb: process.env.MONGODB,
  port: Number(process.env.PORT),
  defaultLimit: Number(process.env.DEFAULT_LIMIT),
  JwtSecret: process.env.JWT_SECRET,
  EmailServer: process.env.EMAIL_SERVER,
  EmailPort: Number(process.env.EMAIL_PORT),
  EmailSecure: Boolean(process.env.EMAIL_SECURE),
  EmailUser: process.env.EMAIL_USER,
  EmailPassword: process.env.EMAIL_PASSWORD,
  EmailFrom: process.env.EMAIL_FROM,
  LinkStatus: process.env.LINK_STATUS,
});
