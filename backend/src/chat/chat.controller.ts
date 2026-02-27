import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { AblyService } from './ably.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly ablyService: AblyService,
  ) {}

  // ── Public — get messages (paginated) ───────────────────
  @Get()
  findAll(@Query('cursor') cursor?: string) {
    return this.chatService.findAll(cursor ? parseInt(cursor) : undefined);
  }

  @Get('count')
  count() {
    return this.chatService.count();
  }

  // ── Public — send a guest message ──────────────────────
  @Post()
  async sendMessage(@Body() dto: CreateMessageDto) {
    const saved = await this.chatService.create({
      name: dto.name,
      content: dto.content,
      isAdmin: false,
      replyToId: dto.replyToId,
    });
    await this.ablyService.publish('guestbook', 'new_message', saved);
    return saved;
  }

  // ── Admin — reply to a message ─────────────────────────
  @UseGuards(JwtAuthGuard)
  @Post('reply')
  async adminReply(@Body() dto: CreateMessageDto) {
    const saved = await this.chatService.create({
      name: 'Admin',
      content: dto.content,
      isAdmin: true,
      replyToId: dto.replyToId,
    });
    await this.ablyService.publish('guestbook', 'new_message', saved);
    return saved;
  }

  // ── Admin — delete a message ───────────────────────────
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.chatService.remove(id);
    await this.ablyService.publish('guestbook', 'message_deleted', { id });
    return { success: true };
  }
}
