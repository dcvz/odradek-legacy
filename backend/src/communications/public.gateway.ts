import { Socket } from 'socket.io'
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets'

export type TaggedSocket = Socket & { sessionId: string }

@WebSocketGateway()
export class PublicGateway {

  //  MARK: - Public Events

  @SubscribeMessage('join')
  handleJoin(@MessageBody() sessionId: string, @ConnectedSocket() client: Socket | TaggedSocket) {
    // @ts-ignore
    client.sessionId = sessionId

    client.join(sessionId)
    console.log(`client: ${client.id} is joining session: ${sessionId}`)
  }

  @SubscribeMessage('transmit-event')
  handleTransmitEvent(@MessageBody() contactItemId: string, @ConnectedSocket() client: TaggedSocket) {
    client.broadcast.to(client.sessionId).emit('contact-event', contactItemId)
  }
}
