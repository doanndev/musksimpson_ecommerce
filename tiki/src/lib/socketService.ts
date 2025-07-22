import { type Socket, io } from 'socket.io-client';
import { env } from './env';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(env.API_WEBSOCKET);
      console.log('Socket connected');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      console.log('Socket disconnected');
    }
  }

  on(event: string, callback: (data: any) => void) {
    this.socket?.on(event, callback);
  }

  emit(event: string, data: any) {
    this.socket?.emit(event, data);
  }

  off(event: string, callback?: (...args: any[]) => void) {
    if (callback) {
      this.socket?.off(event, callback);
    } else {
      this.socket?.off(event);
    }
  }
}

const socketService = new SocketService();
export default socketService;
