import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from "socket.io";
import { NotificationService } from "./notification.service";

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
    methods: ["GET", "POST", "PATCH"],
    credentials: true,
  },
})
export class NotificationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly notificationService: NotificationService) {}

  afterInit(server: Server) {
    console.log("Socket server initialized");
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('lecturerBooking')
  async handleLecturerBooking(client: Socket, payload: any) {
    const { account_id, content } = payload;

    // Lưu thông báo vào cơ sở dữ liệu
    await this.notificationService.create(
      account_id,
      content,
     
    );

    // Gửi thông báo đến các tài khoản có role_id = 1 hoặc 2
    this.server.emit('lecturerBooking', content);
  }
}
