import {
  Controller,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // ── Public — get messages (paginated) ───────────────────
  @Get()
  findAll(@Query('cursor') cursor?: string) {
    return this.chatService.findAll(cursor ? parseInt(cursor) : undefined);
  }

  @Get('count')
  count() {
    return this.chatService.count();
  }

  // ── Admin only ──────────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.chatService.remove(id);
  }
}
