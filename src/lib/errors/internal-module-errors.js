import CustomError from './custom-error';

class InternalModuleError extends CustomError {
  constructor () {
    super();

    this.type = 'Internal-Module-Error';
  }
}

export class MissingArgumentError extends InternalModuleError {
  constructor (message) {
    super();

    this.message = message || 'Missing necessary function argument';
  }
}

export class InvalidActionError extends InternalModuleError {
  constructor (message) {
    super();

    this.message = message || 'The action you are trying to do is not allowed';
  }
}
