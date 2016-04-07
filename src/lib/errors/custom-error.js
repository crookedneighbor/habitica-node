import overExtend from 'over-extend'

export default class CustomError extends overExtend(Error) {
  constructor (message) {
    super()

    this.name = this.constructor.name
    Error.captureStackTrace && Error.captureStackTrace(this, this.constructor)
  }
}
