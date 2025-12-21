import { Response } from 'express';
import { RealtimeRepository } from '../repositories/realtime.js';
import type { Message } from '../../../shared/types/index.js';

interface SSEClient {
  id: string;
  topicId: string;
  res: Response;
  lastPing: number;
}

export class RealtimeService {
  private clients: Map<string, SSEClient> = new Map();
  private realtimeRepo: RealtimeRepository;
  private pingInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.realtimeRepo = new RealtimeRepository();
    this.startPingInterval();
  }

  private startPingInterval() {
    this.pingInterval = setInterval(() => {
      const now = Date.now();
      for (const [clientId, client] of this.clients.entries()) {
        if (now - client.lastPing > 30000) {
          console.log(`Client ${clientId} timed out, removing...`);
          this.removeClient(clientId);
        } else {
          this.sendToClient(client, {
            type: 'ping',
            timestamp: new Date().toISOString(),
          });
        }
      }
    }, 15000);
  }

  async addClient(clientId: string, topicId: string, res: Response): Promise<void> {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    const client: SSEClient = {
      id: clientId,
      topicId,
      res,
      lastPing: Date.now(),
    };

    this.clients.set(clientId, client);

    this.sendToClient(client, {
      type: 'connected',
      data: {
        topic_id: topicId,
        client_id: clientId,
      },
      timestamp: new Date().toISOString(),
    });

    if (!this.realtimeRepo.isSubscribed(topicId)) {
      await this.subscribeToTopic(topicId);
    }

    res.on('close', () => {
      this.removeClient(clientId);
    });
  }

  private async subscribeToTopic(topicId: string): Promise<void> {
    await this.realtimeRepo.subscribeToTopicMessages(
      topicId,
      (message: Message) => {
        this.broadcastToTopic(topicId, {
          type: 'message_added',
          data: message,
          timestamp: new Date().toISOString(),
        });
      },
      (topicUpdate: any) => {
        this.broadcastToTopic(topicId, {
          type: 'topic_updated',
          data: {
            topic_id: topicId,
            state: topicUpdate.state,
            updated_at: topicUpdate.updated_at,
          },
          timestamp: new Date().toISOString(),
        });
      }
    );
  }

  private sendToClient(client: SSEClient, data: any): void {
    try {
      client.res.write(`data: ${JSON.stringify(data)}\n\n`);
      client.lastPing = Date.now();
    } catch (error) {
      console.error(`Error sending to client ${client.id}:`, error);
      this.removeClient(client.id);
    }
  }

  private broadcastToTopic(topicId: string, data: any): void {
    for (const client of this.clients.values()) {
      if (client.topicId === topicId) {
        this.sendToClient(client, data);
      }
    }
  }

  removeClient(clientId: string): void {
    const client = this.clients.get(clientId);
    if (client) {
      try {
        client.res.end();
      } catch (error) {
        console.error(`Error ending response for client ${clientId}:`, error);
      }
      this.clients.delete(clientId);

      const topicHasClients = Array.from(this.clients.values()).some(
        (c) => c.topicId === client.topicId
      );

      if (!topicHasClients) {
        this.unsubscribeFromTopic(client.topicId);
      }
    }
  }

  private async unsubscribeFromTopic(topicId: string): Promise<void> {
    await this.realtimeRepo.unsubscribe(topicId);
  }

  async cleanup(): Promise<void> {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }

    for (const clientId of this.clients.keys()) {
      this.removeClient(clientId);
    }

    await this.realtimeRepo.unsubscribeAll();
  }
}
