import convict from 'convict'
import formats from 'convict-format-with-validator'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
})

convict.addFormats(formats)
convict.addFormat({
  name: 'comma-separated array',
  validate(val) {
    if (!val) {
      throw new Error('Must be defined and a comma-separated array')
    }
  },
  coerce: (val) => val.split(',')
})

const conv = convict({
  root: {
    format: String,
    default: path.join(__dirname, '..', '..')
  },
  host: {
    env: 'HOST',
    format: 'ipaddress',
    default: '0.0.0.0'
  },
  port: {
    env: 'PORT',
    format: 'port',
    default: 4000
  },
  allowedOrigins: {
    env: 'ALLOWED_ORIGINS',
    format: 'comma-separated array',
    default: 'http://localhost:3000'
  },
  maxPoints: {
    env: 'MAX_POINTS',
    format: Number,
    default: 10
  },
  babyfoot: {
    api: {
      env: 'MATCH_API',
      format: 'url',
      default: 'http://localhost:9000/v1'
    }
  },
  battlemythe: {
    api: {
      env: 'BATTLEMYTHE_API',
      format: String,
      default: 'https://dev.battlemythe.net/api/anniv/2020'
    },
    username: {
      env: 'BATTLEMYTHE_API_USERNAME',
      format: String,
      default: ''
    },
    password: {
      env: 'BATTLEMYTHE_API_PASSWORD',
      format: String,
      default: ''
    }
  },
  feature: {
    streaming: {
      env: 'FEATURE_STREAMING',
      format: Boolean,
      default: false
    }
  },
  obs: {
    env: 'OBS',
    format: String,
    default: 'localhost:4444'
  }
})

conv.validate({ allowed: 'strict' })

export const config = conv.get()
