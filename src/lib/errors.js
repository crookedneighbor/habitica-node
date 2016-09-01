import overExtend from 'over-extend'

const INTEGRATION_ERROR_TYPES = Object.freeze({
  MISSING_ARGUMENT: true
})

class CustomError extends overExtend(Error) {
  constructor (message) {
    super()

    this.name = this.constructor.name
    Error.captureStackTrace && Error.captureStackTrace(this, this.constructor)
  }
}

class HabiticaApiError extends CustomError {
  constructor (options = {}) {
    super()

    this.name = `HabiticaApi${options.type}Error`
    this.status = options.status
    this.type = options.type
    this.message = options.message
  }
}

class UnknownConnectionError extends HabiticaApiError {
  constructor (err) {
    super({
      type: 'Unknown',
      message: 'An unknown error occurred'
    })

    this.originalError = err
  }

  static get statusCode () {
    return 'UNKNOWN'
  }
}

class IntegrationError extends CustomError {
  constructor (type, message) {
    super()

    if (!INTEGRATION_ERROR_TYPES.hasOwnProperty(type)) {
      let types = Object.keys(INTEGRATION_ERROR_TYPES).join(', ')
      throw new Error(`type must be one of: ${types}`)
    }

    this.type = type
    this.message = message
  }
}

module.exports = {
  HabiticaApiError,
  UnknownConnectionError,
  IntegrationError
}
