import { io } from 'socket.io-client';
import { resolveApiOrigin } from './backend';

let socket;

const createSocket = async () => {
  if (socket) {
    return socket;
  }

  const origin = await resolveApiOrigin();
  socket = io(origin, {
    autoConnect: false,
    withCredentials: true,
    auth: {
      token: localStorage.getItem('token'),
    },
  });

  return socket;
};

const socketClient = {
  async connect() {
    const instance = await createSocket();
    instance.auth = {
      token: localStorage.getItem('token'),
    };

    if (!instance.connected) {
      instance.connect();
    }

    return instance;
  },

  async disconnect() {
    const instance = await createSocket();
    instance.disconnect();
  },

  async on(event, handler) {
    const instance = await createSocket();
    instance.on(event, handler);
    return instance;
  },

  async off(event, handler) {
    const instance = await createSocket();
    instance.off(event, handler);
    return instance;
  },

  async emit(event, ...args) {
    const instance = await createSocket();
    instance.emit(event, ...args);
    return instance;
  },
};

export default socketClient;
