import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { AblyService } from './ably.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, AblyService],
})
export class ChatModule {}
