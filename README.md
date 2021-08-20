# zenlog

```js
const { createLogger, FileBufferStream } = require('zenlog');

const log = createLogger();
log.addStream(new FileBufferStream({ dir: __dirname }));

log.info('test');

log.child({ err: new Error('error msg') }).error('hello');

log.close();
```
