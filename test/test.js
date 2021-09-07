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

  it('4', async function() {
    const log = createLogger();
    log.child({ host: '127.0.0.1', url: '/url', ip: '11.1.1.1', method: 'GET' }).error('hello');
  });

  it('5', async function() {
    const log = createLogger({ name: 'fei' });
    log.info('name@hostname');
  });
});
