// import .env variables
require('dotenv').config()
const node_env = process.env.NODE_ENV
const host = process.env.HOST
const port = process.env.PORT
const base_url = process.env.BASE_URL
const mongodb_uri = process.env.MONGODB_URI
const password_salt = process.env.PASSWORD_SALT
const token_salt = process.env.TOKEN_SALT
const google_analytics = process.env.GOOGLE_ANALYTICS

module.exports = { 
  node_env,
  host,
  port,
  base_url,
  mongodb_uri,
  password_salt,
  token_salt,
  google_analytics
}