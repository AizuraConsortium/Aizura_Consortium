/**
 * Realtime Service
 *
 * Manages Server-Sent Events (SSE) connections for real-time updates.
 * Handles message broadcasts and topic subscriptions.
 */

import { Response } from 'express';
import { RealtimeRepository } from '../repositories/realtime.js';
import type { Message } from '../../../shared/types/index.js';

/**
 * SSE client connection
 */
interface SSEClient {
  id: string;
  topicId: string;
  res: Response;
  lastPing: number;
}

/**
 * Topic update from database
 */
interface TopicUpdate {
  state: string;
  updated_at: string;
}

/**
 * SSE message types
 */
interface SSEMessage {
  type: 'message_added';
  data: Message;
  timestamp: string;
}

interface SSETopicUpdate {
  type: 'topic_updated';
  data: {
    topic_id: string;
    state: string;
    updated_at: string;
  };
  timestamp: string;
}

interface SSEPing {
  type: 'ping';
  timestamp: string;
}

interface SSEConnected {
  type: 'connected';
  data: {
    topic_id: string;
    client_id: string;
  };
  timestamp: string;
}

/**
 * Union type of all SSE data types
 */
type SSEData = SSEMessage | SSETopicUpdate | SSEPing | SSEConnected;

/**
 * Realtime Service for SSE connections
 *
 * Manages WebSocket-like connections using Server-Sent Events.
 * Handles topic subscriptions and broadcasts updates to connected clients.
 */
export class RealtimeService {
  private clients: Map<string, SSEClient> = new Map();
  private realtimeRepo: RealtimeRepository;
  private pingInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.realtimeRepo = new RealtimeRepository();
    this.startPingInterval();
  }

  /**
   * Start interval to ping clients and remove stale connections
   * Pings every 15 seconds, removes clients inactive for 30+ seconds
   * @private
   */
  private startPingInterval(): void {
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

  /**
   * Add a new SSE client connection
   *
   * @param clientId - Unique client identifier
   * @param topicId - Topic to subscribe to
   * @param res - Express response object
   */
  async addClient(clientId: string, topicId: string, res: Response): Promise<void> {
    // Set SSE headers
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

    // Send connected event
    this.sendToClient(client, {
      type: 'connected',
      data: {
        topic_id: topicId,
        client_id: clientId,
      },
      timestamp: new Date().toISOString(),
    });

    // Subscribe to topic if not already subscribed
    if (!this.realtimeRepo.isSubscribed(topicId)) {
      await this.subscribeToTopic(topicId);
    }

    // Clean up on client disconnect
    res.on('close', () => {
      this.removeClient(clientId);
    });
  }

  /**
   * Subscribe to topic changes in database
   *
   * @param topicId - Topic to subscribe to
   * @private
   */
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
      (topicUpdate: TopicUpdate) => {
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

  /**
   * Send data to a specific client
   *
   * @param client - SSE client
   * @param data - Data to send
   * @private
   */
  private sendToClient(client: SSEClient, data: SSEData): void {
    try {
      client.res.write(`data: ${JSON.stringify(data)}\n\n`);
      client.lastPing = Date.now();
    } catch (error) {
      console.error(`Error sending to client ${client.id}:`, error);
      this.removeClient(client.id);
    }
  }

  /**
   * Broadcast data to all clients subscribed to a topic
   *
   * @param topicId - Topic to broadcast to
   * @param data - Data to broadcast
   * @private
   */
  private broadcastToTopic(topicId: string, data: SSEData): void {
    for (const client of this.clients.values()) {
      if (client.topicId === topicId) {
        this.sendToClient(client, data);
      }
    }
  }

  /**
   * Remove a client and clean up subscriptions
   *
   * @param clientId - Client ID to remove
   */
  removeClient(clientId: string): void {
    const client = this.clients.get(clientId);
    if (client) {
      try {
        client.res.end();
      } catch (error) {
        console.error(`Error ending response for client ${clientId}:`, error);
      }
      this.clients.delete(clientId);

      // Unsubscribe from topic if no more clients
      const topicHasClients = Array.from(this.clients.values()).some(
        (c) => c.topicId === client.topicId
      );

      if (!topicHasClients) {
        this.unsubscribeFromTopic(client.topicId);
      }
    }
  }

  /**
   * Unsubscribe from topic updates
   *
   * @param topicId - Topic to unsubscribe from
   * @private
   */
  private async unsubscribeFromTopic(topicId: string): Promise<void> {
    await this.realtimeRepo.unsubscribe(topicId);
  }

  /**
   * Clean up all connections and subscriptions
   * Should be called when server shuts down
   */
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
