import {
 API_ERRORS,
} from '../../src/lib/errors';

describe('API Errors', () => {
  describe('UnknownConnectionError', () => {
    it('instantiates an error', () => {
      let error = new API_ERRORS.UNKNOWN();

      expect(error.name).to.eql('UnknownConnectionError');
      expect(error.message).to.eql('An unknown error occurred');
    });

    it('saves original error', () => {
      let originalError = new Error('foo');
      let error = new API_ERRORS.UNKNOWN(originalError);

      expect(error.originalError).to.eql(originalError);
    });

    it('does not create a new message', () => {
      let originalError = new Error('foo');
      let error = new API_ERRORS.UNKNOWN(originalError);

      expect(error.message).to.eql('An unknown error occurred');
    });
  });

  describe('NotAuthenticatedError', () => {
    it('instantiates an error', () => {
      let error = new API_ERRORS['401']();

      expect(error.name).to.eql('NotAuthenticatedError');
      expect(error.message).to.eql('You are not authenticated');
    });

    it('can pass a custom message', () => {
      let error = new API_ERRORS['401']('foo');

      expect(error.message).to.eql('foo');
    });
  });

  describe('NotAuthorizedError', () => {
    it('instantiates an error', () => {
      let error = new API_ERRORS['403']();

      expect(error.name).to.eql('NotAuthorizedError');
      expect(error.message).to.eql('You are not authorized to perform that action');
    });

    it('can pass a custom message', () => {
      let error = new API_ERRORS['403']('foo');

      expect(error.message).to.eql('foo');
    });
  });

  describe('NotFoundError', () => {
    it('instantiates an error', () => {
      let error = new API_ERRORS['404']();

      expect(error.name).to.eql('NotFoundError');
      expect(error.message).to.eql('The resource could not be found');
    });

    it('can pass a custom message', () => {
      let error = new API_ERRORS['404']('foo');

      expect(error.message).to.eql('foo');
    });
  });

  describe('InternalServerError', () => {
    it('instantiates an error', () => {
      let error = new API_ERRORS['500']();

      expect(error.name).to.eql('InternalServerError');
      expect(error.message).to.eql('An internal server error occurred');
    });

    it('can pass a custom message', () => {
      let error = new API_ERRORS['500']('foo');

      expect(error.message).to.eql('foo');
    });
  });
});
