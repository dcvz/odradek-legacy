import { Socket } from 'socket.io'
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets'

export type TaggedSocket = Socket & { sessionId: string }

@WebSocketGateway()
export class CommunicationGateway {

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
    console.log(`client: ${client.id} is transmitting event: ${contactItemId} to session: ${client.sessionId}`)
    client.broadcast.to(client.sessionId).emit('contact-event', contactItemId)
  }
}
