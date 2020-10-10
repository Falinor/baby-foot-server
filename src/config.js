import convict from "convict";

const config = convict({
  port: {
    env: 'PORT',
    format: Number,
    default: 3000
  }
})

config.validate({ allowed: 'strict' })

export default config.get()
