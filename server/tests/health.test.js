import assert from 'node:assert/strict';
import createApp from '../app.js';

const run = async () => {
  const app = createApp();
  const server = app.listen(0);

  try {
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}/api/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, {
      status: 'ok',
      message: 'Broken health message'
    });

    console.log('Health check test passed');
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }
};

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
