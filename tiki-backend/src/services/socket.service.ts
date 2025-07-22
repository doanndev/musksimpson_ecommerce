import type { Server as IOServer, Socket } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents } from '../types/socketEvents';

class SocketService {
  private io: IOServer<ClientToServerEvents, ServerToClientEvents> | null = null;

  public init(ioInstance: IOServer<ClientToServerEvents, ServerToClientEvents>): void {
    this.io = ioInstance;
    console.log('SocketService initialized');

    // Lắng nghe sự kiện kết nối client
    this.io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
      // Client gửi userId để join vào room riêng
      socket.on('joinRoom', (userId: string) => {
        console.log(`Socket ${socket.id} joined room user_${userId}`);
        socket.join(`user_${userId}`);
      });

      socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
      });
    });
  }

  public emit<T extends keyof ServerToClientEvents>(event: T, ...args: Parameters<ServerToClientEvents[T]>): void {
    if (this.io) {
      this.io.emit(event, ...args);
    } else {
      console.error('SocketService: io not initialized');
    }
  }

  // Emit event chỉ tới 1 room (ví dụ userId)
  public emitToRoom<T extends keyof ServerToClientEvents>(
    room: string,
    event: T,
    ...args: Parameters<ServerToClientEvents[T]>
  ): void {
    if (this.io) {
      this.io.to(room).emit(event, ...args);
    } else {
      console.error('SocketService: io not initialized');
    }
  }
}

export default new SocketService();
