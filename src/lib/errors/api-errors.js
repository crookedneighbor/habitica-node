import CustomError from './custom-error'

class HabiticaApiError extends CustomError {
  constructor () {
    super()

    this.type = 'Habitica-API-Error'
  }
}

export class UnknownConnectionError extends HabiticaApiError {
  constructor (err) {
    super()

    this.message = 'An unknown error occurred'
    this.originalError = err
  }

  static get statusCode () {
    return 'UNKNOWN'
  }
}

export class NotAuthenticatedError extends HabiticaApiError {
  constructor (customMessage) {
    super()

    this.message = customMessage || 'You are not authenticated'
  }

  static get statusCode () {
    return 401
  }
}

export class NotAuthorizedError extends HabiticaApiError {
  constructor (customMessage) {
    super()

    this.statusCode = 403
    this.message = customMessage || 'You are not authorized to perform that action'
  }

  static get statusCode () {
    return 403
  }
}

export class NotFoundError extends HabiticaApiError {
  constructor (customMessage) {
    super()

    this.message = customMessage || 'The resource could not be found'
  }

  static get statusCode () {
    return 404
  }
}

export class InternalServerError extends HabiticaApiError {
  constructor (customMessage) {
    super()

    this.message = customMessage || 'An internal server error occurred'
  }

  static get statusCode () {
    return 500
  }
}
