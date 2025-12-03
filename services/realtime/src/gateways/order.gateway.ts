import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

interface OrderUpdate {
  orderId: string
  userId: string
  marketId: string
  type: 'BUY_UP' | 'BUY_DOWN'
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED'
  entryPrice: number
  exitPrice?: number
  profit?: number
  timestamp: string
}

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3002'],
    credentials: true,
  },
  namespace: '/orders',
})
export class OrderGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('OrderGateway');
  private userConnections: Map<string, Set<string>> = new Map();

  afterInit(server: Server) {
    this.logger.log('Order WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected to orders: ${client.id}`);
    client.emit('connection', { status: 'connected', clientId: client.id });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected from orders: ${client.id}`);
    // Clean up user subscriptions
    this.userConnections.forEach((clients, userId) => {
      clients.delete(client.id);
      if (clients.size === 0) {
        this.userConnections.delete(userId);
      }
    });
  }

  @SubscribeMessage('subscribeUser')
  handleSubscribeUser(client: Socket, payload: { userId: string }) {
    const { userId } = payload;
    this.logger.log(`Client ${client.id} subscribing to user orders: ${userId}`);

    // Add client to user subscription
    if (!this.userConnections.has(userId)) {
      this.userConnections.set(userId, new Set());
    }
    this.userConnections.get(userId).add(client.id);

    // Join room for this user
    client.join(`user:${userId}`);

    client.emit('subscribed', { userId, clientId: client.id });
    return { success: true, userId };
  }

  @SubscribeMessage('unsubscribeUser')
  handleUnsubscribeUser(client: Socket, payload: { userId: string }) {
    const { userId } = payload;
    this.logger.log(`Client ${client.id} unsubscribing from user orders: ${userId}`);

    // Remove client from user subscription
    const clients = this.userConnections.get(userId);
    if (clients) {
      clients.delete(client.id);
      if (clients.size === 0) {
        this.userConnections.delete(userId);
      }
    }

    // Leave room
    client.leave(`user:${userId}`);

    client.emit('unsubscribed', { userId, clientId: client.id });
    return { success: true, userId };
  }

  // Broadcast order update to specific user
  broadcastOrderUpdate(userId: string, orderUpdate: OrderUpdate) {
    this.server.to(`user:${userId}`).emit('orderUpdate', {
      ...orderUpdate,
      timestamp: new Date().toISOString(),
    });
  }

  // Broadcast to all connected clients (admin notifications)
  broadcastToAll(event: string, data: any) {
    this.server.emit(event, data);
  }

  // Get active user subscriptions count
  getSubscriptionsCount(): number {
    return this.userConnections.size;
  }

  // Get connected clients count
  getConnectedClientsCount(): number {
    return this.server.sockets.sockets.size;
  }
}
