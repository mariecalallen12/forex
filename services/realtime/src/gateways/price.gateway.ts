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

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3002'],
    credentials: true,
  },
  namespace: '/price',
})
export class PriceGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('PriceGateway');
  private subscribedMarkets: Map<string, Set<string>> = new Map();

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    client.emit('connection', { status: 'connected', clientId: client.id });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // Clean up subscriptions
    this.subscribedMarkets.forEach((clients, market) => {
      clients.delete(client.id);
      if (clients.size === 0) {
        this.subscribedMarkets.delete(market);
      }
    });
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, payload: { markets: string[] }) {
    const { markets } = payload;
    this.logger.log(`Client ${client.id} subscribing to: ${markets.join(', ')}`);

    markets.forEach((market) => {
      // Add client to market subscription
      if (!this.subscribedMarkets.has(market)) {
        this.subscribedMarkets.set(market, new Set());
      }
      this.subscribedMarkets.get(market).add(client.id);

      // Join room for this market
      client.join(`market:${market}`);
    });

    client.emit('subscribed', { markets, clientId: client.id });
    return { success: true, markets };
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(client: Socket, payload: { markets: string[] }) {
    const { markets } = payload;
    this.logger.log(`Client ${client.id} unsubscribing from: ${markets.join(', ')}`);

    markets.forEach((market) => {
      // Remove client from market subscription
      const clients = this.subscribedMarkets.get(market);
      if (clients) {
        clients.delete(client.id);
        if (clients.size === 0) {
          this.subscribedMarkets.delete(market);
        }
      }

      // Leave room
      client.leave(`market:${market}`);
    });

    client.emit('unsubscribed', { markets, clientId: client.id });
    return { success: true, markets };
  }

  // Method to broadcast price updates to subscribed clients
  broadcastPriceUpdate(marketId: string, priceData: any) {
    this.server.to(`market:${marketId}`).emit('priceUpdate', {
      marketId,
      ...priceData,
      timestamp: new Date().toISOString(),
    });
  }

  // Broadcast to all connected clients
  broadcastToAll(event: string, data: any) {
    this.server.emit(event, data);
  }

  // Get active subscriptions count
  getSubscriptionsCount(): number {
    return this.subscribedMarkets.size;
  }

  // Get connected clients count
  getConnectedClientsCount(): number {
    return this.server.sockets.sockets.size;
  }
}
