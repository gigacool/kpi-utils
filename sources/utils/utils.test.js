const utils = require('./utils');

describe('util tests', () => {
  it('should export utils', () => {
    expect(utils).toBeDefined();
  });

  describe('process error', () => {
    let mockExit; let
      mockConsoleError;

    beforeEach(() => {
      mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
      mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      mockExit.mockRestore();
      mockConsoleError.mockRestore();
    });

    it('should export a processError function', () => {
      expect(typeof utils.processError).toBe('function');
    });

    it('should do nothing when no error is provided', () => {
      // given
      // when
      utils.processError();
      // then
      expect(mockExit.mock.calls.length).toBe(0);
    });

    it('should call console.error on error', () => {
      // given
      // when
      utils.processError('ouch');
      // then
      expect(mockConsoleError).toHaveBeenCalledWith('ouch');
      expect(mockExit).toHaveBeenCalledWith(-1);
    });

    it('should call console.error on error', () => {
      // given
      const err = { message: 'ouch' };
      // when
      utils.processError(err);
      // then
      expect(mockConsoleError).toHaveBeenCalledWith(JSON.stringify(err, null, 2));
      expect(mockExit).toHaveBeenCalledWith(-1);
    });
  });
});
