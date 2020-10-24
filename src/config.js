import convict from "convict";

const config = convict({
  host: {
    env: 'HOST',
    format: String,
    default: '0.0.0.0'
  },
  port: {
    env: 'PORT',
    format: Number,
    default: 3000
  }
})

config.validate({ allowed: 'strict' })

export default config.get()
