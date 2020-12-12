import convict from 'convict'
import formats from 'convict-format-with-validator'

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
    userId: {
      env: 'BATTLEMYTHE_USER_ID',
      format: String,
      default: ''
    },
    password: {
      env: 'BATTLEMYTHE_PASSWORD',
      format: String,
      default: ''
    }
  }
})

conv.validate({ allowed: 'strict' })

export const config = conv.get()
