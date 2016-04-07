import {
 INTERNAL_MODULE_ERRORS,
} from '../../src/lib/errors';

describe('Internal Module Errors', () => {
  describe('MissingArgumentError', () => {
    it('instantiates an error', () => {
      let error = new INTERNAL_MODULE_ERRORS.MissingArgumentError();

      expect(error.name).to.eql('MissingArgumentError');
      expect(error.message).to.eql('Missing necessary function argument');
    });

    it('does not pass along a custom message', () => {
      let error = new INTERNAL_MODULE_ERRORS.MissingArgumentError('foo');

      expect(error.message).to.eql('foo');
    });
  });
});
