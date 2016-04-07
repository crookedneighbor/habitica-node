import * as apiErrors from './api-errors';
import * as internalModuleErrors from './internal-module-errors';

export const API_ERRORS = { };
export const INTERNAL_MODULE_ERRORS = internalModuleErrors;

for (let key in apiErrors) {
  if (apiErrors.hasOwnProperty(key)) {
    let error = apiErrors[key];

    API_ERRORS[error.statusCode] = error;
  }
}
