import { OnModuleInit } from '@nestjs/common';
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { ChatMessageDTO } from 'src/dto/ChatMessageDTO';

@WebSocketGateway({
    cors: {
        origin: '*',
        credentials: true,
        methods: ['POST', 'GET'],
    },
    path: '',
})
export class MyGateway implements OnModuleInit {
    @WebSocketServer()
    server: Server;

    private socket: Socket<
        DefaultEventsMap,
        DefaultEventsMap,
        DefaultEventsMap,
        any
    >;
    private chatMessages: Array<ChatMessageDTO> = [];
    private onlineUsers: number = 0;

    onModuleInit() {
        this.server.on('connection', (socket) => {
            this.onlineUsers++;

            socket.emit('onUserConnect', { onlineUsers: this.onlineUsers });

            console.log(
                'Client connected -> ',
                socket.id,
                new Date().toLocaleTimeString(),
            );

            socket.emit('onLogin', {
                onlineUsers: this.onlineUsers,
                chatMessages: this.chatMessages,
            });

            socket.on('disconnect', (reason) => {
                this.onlineUsers--;

                socket.emit('onUserDisconnect', {
                    onlineUsers: this.onlineUsers,
                });

                console.log(
                    'Client disconnected -> ',
                    socket.id,
                    'Reason: ',
                    reason,
                    new Date().toLocaleTimeString(),
                );
            });
        });
    }

    @SubscribeMessage('chatMessage')
    // @UsePipes(
    //     new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    // )
    onNewMessage(@MessageBody() body: ChatMessageDTO) {
        if (
            typeof body !== 'object' ||
            !body ||
            !body.sender ||
            body.message === ''
        ) {
            console.log('mensagem vazia');
            return;
        }
        const message = new ChatMessageDTO(body);
        this.server.emit('onChatMessage', message);

        this.chatMessages.push(message);
    }
}
