import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async findAll(cursor?: number, take = 50) {
    return this.prisma.guestMessage.findMany({
      where: cursor ? { id: { lt: cursor } } : undefined,
      orderBy: { createdAt: 'desc' },
      take,
      include: {
        replies: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async create(data: { name: string; content: string; isAdmin?: boolean; replyToId?: number }) {
    return this.prisma.guestMessage.create({
      data: {
        name: data.name,
        content: data.content,
        isAdmin: data.isAdmin ?? false,
        replyToId: data.replyToId ?? null,
      },
      include: {
        replies: true,
      },
    });
  }

  async remove(id: number) {
    const msg = await this.prisma.guestMessage.findUnique({ where: { id } });
    if (!msg) throw new NotFoundException(`Message #${id} not found`);
    return this.prisma.guestMessage.delete({ where: { id } });
  }

  async count() {
    return this.prisma.guestMessage.count();
  }
}
