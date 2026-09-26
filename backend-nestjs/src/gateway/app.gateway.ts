import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AppGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_contest')
  handleJoinContest(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const { contestId, userId } = data;
    if (contestId && userId) {
      const roomName = `contest_${contestId}`;
      client.join(roomName);
      this.logger.log(`User ${userId} joined room ${roomName}`);
      client.to(roomName).emit('user_joined', { userId });
    }
  }

  @SubscribeMessage('leave_contest')
  handleLeaveContest(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const { contestId, userId } = data;
    if (contestId && userId) {
      const roomName = `contest_${contestId}`;
      client.leave(roomName);
      this.logger.log(`User ${userId} left room ${roomName}`);
      client.to(roomName).emit('user_left', { userId });
    }
  }

  @SubscribeMessage('join_user')
  handleJoinUser(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const { userId } = data;
    if (userId) {
      const roomName = `user_${userId}`;
      client.join(roomName);
      this.logger.log(`User ${userId} joined room ${roomName}`);
    }
  }

  // Used to notify all clients in a contest room
  broadcastToContest(contestId: string, event: string, data: any) {
    const roomName = `contest_${contestId}`;
    this.server.to(roomName).emit(event, data);
  }

  // Used to notify a specific user
  emitToUser(userId: string, event: string, data: any) {
    const roomName = `user_${userId}`;
    this.server.to(roomName).emit(event, data);
  }
}
