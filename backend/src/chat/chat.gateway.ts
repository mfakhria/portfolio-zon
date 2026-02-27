import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/chat',
  transports: ['websocket', 'polling'],
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private onlineCount = 0;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  handleConnection() {
    this.onlineCount++;
    this.server.emit('online_count', this.onlineCount);
  }

  handleDisconnect() {
    this.onlineCount = Math.max(0, this.onlineCount - 1);
    this.server.emit('online_count', this.onlineCount);
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() data: { name: string; content: string; replyToId?: number },
    @ConnectedSocket() client: Socket,
  ) {
    // Basic validation
    if (!data.name?.trim() || !data.content?.trim()) {
      client.emit('error_message', { message: 'Name and content are required.' });
      return;
    }
    if (data.name.length > 50 || data.content.length > 500) {
      client.emit('error_message', { message: 'Name (max 50) or content (max 500) too long.' });
      return;
    }

    const saved = await this.chatService.create({
      name: data.name.trim(),
      content: data.content.trim(),
      isAdmin: false,
      replyToId: data.replyToId,
    });

    this.server.emit('new_message', saved);
  }

  @SubscribeMessage('admin_reply')
  async handleAdminReply(
    @MessageBody() data: { content: string; replyToId: number; token: string },
    @ConnectedSocket() client: Socket,
  ) {
    // Verify JWT
    try {
      this.jwtService.verify(data.token, {
        secret: process.env.JWT_SECRET || 'fallback-secret',
      });
    } catch {
      client.emit('error_message', { message: 'Unauthorized.' });
      return;
    }

    if (!data.content?.trim()) {
      client.emit('error_message', { message: 'Content is required.' });
      return;
    }

    const saved = await this.chatService.create({
      name: 'Admin',
      content: data.content.trim(),
      isAdmin: true,
      replyToId: data.replyToId,
    });

    this.server.emit('new_message', saved);
  }

  @SubscribeMessage('admin_delete')
  async handleAdminDelete(
    @MessageBody() data: { id: number; token: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      this.jwtService.verify(data.token, {
        secret: process.env.JWT_SECRET || 'fallback-secret',
      });
    } catch {
      client.emit('error_message', { message: 'Unauthorized.' });
      return;
    }

    await this.chatService.remove(data.id);
    this.server.emit('message_deleted', { id: data.id });
  }

  @SubscribeMessage('load_messages')
  async handleLoadMessages(
    @MessageBody() data: { cursor?: number },
    @ConnectedSocket() client: Socket,
  ) {
    const messages = await this.chatService.findAll(data?.cursor);
    client.emit('messages_loaded', messages);
  }
}
