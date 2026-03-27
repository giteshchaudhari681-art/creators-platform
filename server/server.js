import net from 'net';
import app, { httpServer } from './app.js';

const DEFAULT_PORT = Number(process.env.PORT || 5000);
const MAX_PORT_ATTEMPTS = Number(process.env.PORT_RETRY_LIMIT || 10);

const isPortAvailable = (port) => new Promise((resolve) => {
  const tester = net.createServer();

  tester.once('error', (error) => {
    resolve(error.code !== 'EADDRINUSE');
  });

  tester.once('listening', () => {
    tester.close(() => resolve(true));
  });

  tester.listen(port);
});

const findAvailablePort = async (startingPort) => {
  for (let offset = 0; offset <= MAX_PORT_ATTEMPTS; offset += 1) {
    const candidatePort = startingPort + offset;
    const available = await isPortAvailable(candidatePort);

    if (available) {
      if (candidatePort !== startingPort) {
        console.warn(`Port ${startingPort} is busy. Using port ${candidatePort} instead.`);
      }
      return candidatePort;
    }
  }

  throw new Error(
    `Unable to find an open port between ${startingPort} and ${startingPort + MAX_PORT_ATTEMPTS}.`
  );
};

const startServer = async () => {
  try {
    const port = await findAvailablePort(DEFAULT_PORT);
    app.set('port', port);

    httpServer.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
      console.log('Socket.io ready for connections');
    });
  } catch (error) {
    console.error(error.message);
    console.error('Stop the existing process or set a different PORT in server/.env.');
    process.exit(1);
  }
};

startServer();
