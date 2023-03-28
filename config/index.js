// import .env variables
require("dotenv").config();
const node_env = process.env.NODE_ENV;
const host = process.env.HOST;
const port = process.env.PORT;
const base_url = process.env.BASE_URL;
const mongodb_uri = process.env.MONGODB_URI;
const password_salt = process.env.PASSWORD_SALT;
const token_salt = process.env.TOKEN_SALT;
const google_analytics = process.env.GOOGLE_ANALYTICS;

// firebase config object
const firebase = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};
// const firebaseApiKey = process.env.FIREBASE_API_KEY;
// const firebaseAuthDomain = process.env.FIREBASE_AUTH_DOMAIN;
// const firebaseDatabaseURL = process.env.FIREBASE_DATABASE_URL;
// const firebaseProjectId = process.env.FIREBASE_PROJECT_ID;
// const firebaseStorageBucket = process.env.FIREBASE_STORAGE_BUCKET;
// const firebaseMessagingSenderId = process.env.FIREBASE_MESSAGING_SENDER_ID;
// const firebaseAppId = process.env.FIREBASE_APP_ID;
// const firebaseMeasurementId = process.env.FIREBASE_MEASUREMENT_ID;

module.exports = {
  node_env,
  host,
  port,
  base_url,
  mongodb_uri,
  password_salt,
  token_salt,
  google_analytics,
  firebase,
};
