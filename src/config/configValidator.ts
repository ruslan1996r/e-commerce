import Joi from 'joi';

import { Config } from './';

export const basicDefenition: { [index in Config]: Joi.StringSchema } = {
  [Config.PORT]: Joi.string().default('3000'),
  [Config.DEPLOY_ENV]: Joi.string()
    .valid('development', 'production', 'staging')
    .default('development')
    .required(),
  [Config.POSTGRES_PORT]: Joi.string().default('5432'),
  [Config.POSTGRES_HOST]: Joi.string(),
  [Config.POSTGRES_USER]: Joi.string(),
  [Config.POSTGRES_DB]: Joi.string(),
  [Config.POSTGRES_PASSWORD]: Joi.string(),
  [Config.POSTGRES_URL]: Joi.string().uri(),
  [Config.NODE_TLS_REJECT_UNAUTHORIZED]: Joi.string(),
  [Config.GOOGLE_AUTH_ID]: Joi.string().required(),
  [Config.GOOGLE_AUTH_SECRET]: Joi.string().required(),
  [Config.GOOGLE_MAIL_ID]: Joi.string(),
  [Config.GOOGLE_MAIL_SECRET]: Joi.string(),
  [Config.GOOGLE_MAIL_REDIRECT_URL]: Joi.string().uri(),
  [Config.GOOGLE_MAIL_REFRESH_TOKEN]: Joi.string(),
  [Config.GOOGLE_MAIL_SENDER]: Joi.string(),
  [Config.NOVA_POSHTA_URL]: Joi.string().uri(),
  [Config.NOVA_POSHTA_KEY]: Joi.string(),
  [Config.PAYMENT_PUBLIC_KEY]: Joi.string(),
  [Config.PAYMENT_SECRET_KEY]: Joi.string(),
  [Config.LOCAL_AUTH_SECRET]: Joi.string().required(),
  [Config.SESSION_SECRET]: Joi.string().required(),
  [Config.SERVER_URL]: Joi.string().uri(),
};

export const configValidationSchema = Joi.object(basicDefenition);
