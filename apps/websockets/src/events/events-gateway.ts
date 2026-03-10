import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WeJwtGuard } from '../auth/we-jwt/we-jwt.guard';
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsAuthMiddleware } from '../auth/ws.middleware';

@WebSocketGateway({ cors: { origin: '*' } })
//@UseGuards(WeJwtGuard)
export class EventsGateway implements OnGatewayConnection {
  constructor(private jwtService: JwtService) {}
  @WebSocketServer() server: Server;

  afterInit(client: Socket) {
    this.server.use(WsAuthMiddleware(this.jwtService));
  }
  // Built in
  async handleConnection(client: Socket) {
    //console.log(`New client joined: ${client.id}`);

    // You can attach custom data to the client object safely
    client['user']['sockerId'] = client.id;
    console.log(client['user']);
  }

  // Built in
  async handleDisconnect(client: Socket) {
    const userId = client['user']?.userId; // Assuming you attached user during handleConnection

    console.log(`User ${userId} (Socket: ${client.id}) disconnected.`);

    if (userId) {
      // 1. Logic: Update Database status to "Offline"
      // await this.userService.updateStatus(userId, 'offline');

      // 2. Logic: Notify their friends/rooms
      this.server.emit('user_status_changed', {
        userId,
        status: 'offline',
      });
    }
  }

  @SubscribeMessage('message') // which server listen to
  handleMessage2(@ConnectedSocket() client: Socket, payload: any): string {
    return client.id; //'Hello world!';
  }

  @SubscribeMessage('user_message') // which server listen to
  handleUserMessage(client: any, payload: any): string {
    return `user message ${payload}`; //'Hello world!';
  }

  sendMessage() {
    //this.server.to(socketId).emit('notify', message);
    // Event listen
    this.server.emit('newMessage', 'Hello from the server!');
  }

  @SubscribeMessage('join_chat')
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    // 🟢 One line of code to "subscribe" the user to this room
    await client.join(data.roomId); // join room
    // await client.leave(data.roomId); // leave room
    console.log(`User ${client.id} joined room: ${data.roomId}`);
  }

  @SubscribeMessage('send_msg')
  async handleMessage(
    @MessageBody() data: { roomId: string; message: string },
  ) {
    // 🟢 This sends to EVERYONE in that room (including the sender)
    await this.server.to(data.roomId).emit('new_msg', data.message);

    // 🟡 Or send to everyone EXCEPT the sender:
    // client.to(data.roomId).emit('new_msg', data.message);
  }

  // async handleConnection(client: Socket) {
  //   try {
  //     // 1. Get token from handshake (auth object or headers)
  //     // const token =
  //     //   client.handshake.auth.token || client.handshake.headers.authorization;
  //
  //     // 2. Verify JWT
  //     //const payload = await this.jwtService.verifyAsync(token);
  //
  //     // 3. Attach user data to the socket for later use
  //     //client['user'] = payload;
  //     console.log(`User connected: ${client}`);
  //   } catch (e) {
  //     // 4. Disconnect if unauthorized
  //     client.disconnect();
  //   }
  // }
}
