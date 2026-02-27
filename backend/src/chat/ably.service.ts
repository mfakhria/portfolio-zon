import { Injectable, OnModuleInit } from '@nestjs/common';
import Ably from 'ably';

@Injectable()
export class AblyService implements OnModuleInit {
  private ably: Ably;

  onModuleInit() {
    const apiKey = process.env.ABLY_API_KEY;
    if (!apiKey) {
      console.warn('⚠️  ABLY_API_KEY not set — real-time features disabled');
      return;
    }
    this.ably = new Ably({ key: apiKey });
  }

  async publish(channel: string, event: string, data: any) {
    if (!this.ably) return;
    const ch = this.ably.channels.get(channel);
    await ch.publish(event, data);
  }
}
