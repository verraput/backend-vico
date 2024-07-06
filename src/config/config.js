const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envValidation = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("development", "production", "test")
      .required(),
    PORT: Joi.number().default(3000),
    BUCKET_URL: Joi.string().required(),
    DB_HOST: Joi.string().default("localhost"),
    DB_USER: Joi.string().required(),
    DB_PASS: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    DB_PORT: Joi.string().required(),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description("minutes after which access tokens expire"),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description("days after which refresh tokens expire"),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("minutes after which reset password token expires"),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("minutes after which verify email token expires"),
    LOG_FOLDER: Joi.string().required(),
    LOG_FILE: Joi.string().required(),
    LOG_LEVEL: Joi.string().required(),
    REDIS_HOST: Joi.string().default("127.0.0.1"),
    REDIS_PORT: Joi.number().default(6379),
    REDIS_USE_PASSWORD: Joi.string().default("no"),
    REDIS_PASSWORD: Joi.string(),
  })
  .unknown();

const { value: envVar, error } = envValidation
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  nodeEnv: envVar.NODE_ENV,
  port: envVar.PORT,
  bucketUrl: envVar.BUCKET_URL,
  dbHost: envVar.DB_HOST,
  dbUser: envVar.DB_USER,
  dbPass: envVar.DB_PASS,
  dbName: envVar.DB_NAME,
  dbPort: envVar.DB_PORT,
  jwt: {
    secret: envVar.JWT_SECRET,
    accessExpirationMinutes: envVar.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVar.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes:
      envVar.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVar.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  logConfig: {
    logFolder: envVar.LOG_FOLDER,
    logFile: envVar.LOG_FILE,
    logLevel: envVar.LOG_LEVEL,
  },
  redis: {
    host: envVar.REDIS_HOST,
    port: envVar.REDIS_PORT,
    usePassword: envVar.REDIS_USE_PASSWORD,
    password: envVar.REDIS_PASSWORD,
  },
  firebase_type: envVar.firebase_type,
  firebase_project_id: envVar.firebase_project_id,
  firebase_private_key_id: envVar.firebase_private_key_id,
  firebase_private_key: envVar.firebase_private_key,
  firebase_client_email: envVar.firebase_client_email,
  firebase_client_id: envVar.firebase_client_id,
  firebase_auth_uri: envVar.firebase_auth_uri,
  firebase_token_uri: envVar.firebase_token_uri,
  firebase_auth_provider_x509_cert_url:
    envVar.firebase_auth_provider_x509_cert_url,
  firebase_client_x509_cert_url: envVar.firebase_client_x509_cert_url,
  firebase_universe_domain: envVar.firebase_universe_domain,
};
