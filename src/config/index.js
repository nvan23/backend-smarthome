require('dotenv').config() // load .env file

module.exports = {
  port: process.env.PORT,
  app: process.env.APP,
  env: process.env.NODE_ENV,
  secret: process.env.APP_SECRET,
  token_life: process.env.ACCESS_TOKEN_LIFE,
  mongo: {
    uri: process.env.MONGODB_URL
  },
  roles: {
    admin: process.env.ADMIN,
    host: process.env.HOST,
    user: process.env.USER,
  },
  default: {
    host: {
      name: process.env.HOST_NAME,
      username: process.env.HOST_USERNAME,
      password: process.env.HOST_PASSWORD,
      email: process.env.HOST_MAIL,
    },
  },
  mqtt: {
    host: process.env.MQTT_HOST,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
  },
  email: {
    host: {
      address: process.env.MAIL_USERNAME,
      password: process.env.MAIL_PASSWORD,
    },
    secret: process.env.MAIL_SECRET,
    tokenLife: process.env.MAIL_TOKEN_LIFE,
  },
  oauth: {
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  }
}
