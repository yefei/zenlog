'use strict';

const { createLogger, FileBufferStream } = require('..');

describe('zenlog', function() {
  it('1', async function() {
    const log = createLogger();
    log.info('hello');
  });

  it('2', async function() {
    const log = createLogger();
    log.child({ err: new Error('error msg') }).error('hello');
  });

  it('3', async function() {
    const log = createLogger();
    log.addStream(new FileBufferStream({ dir: __dirname }));
    log.child({ err: new Error('error msg') }).error('hello');
    log.close();
  });
});
