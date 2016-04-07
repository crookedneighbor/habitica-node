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

