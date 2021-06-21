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
    },
  }
}
