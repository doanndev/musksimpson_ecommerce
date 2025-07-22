export interface ServerToClientEvents {
  orderUpdated: (message: string) => void;
  joinRoom: (token: string) => void;
}

export interface ClientToServerEvents {
  orderUpdated: (message: string) => void;
  joinRoom: (token: string) => void;
}
