/**
 * Dependency Injection Container
 *
 * Centralized registry for all controllers and services.
 * Provides type-safe access to instances with singleton management.
 * Eliminates circular dependencies and enables proper lifecycle management.
 *
 * @example
 * // Initialize the container
 * const container = Container.getInstance();
 * await container.initialize();
 *
 * // Get a controller
 * const healthController = container.get('healthController');
 */

import { HealthController } from '../controllers/healthController.js';
import { WebhookController } from '../controllers/webhookController.js';
import { ErrorController } from '../controllers/errorController.js';
import { SystemController } from '../../admin/controllers/systemController.js';
import { UserController } from '../../admin/controllers/userController.js';
import { ErrorController as AdminErrorController } from '../../admin/controllers/errorController.js';
import { OrchestratorController } from '../../admin/controllers/orchestratorController.js';
import { AuditController } from '../../admin/controllers/auditController.js';
import { TopicController } from '../../consortium/controllers/topicController.js';
import { MessageController } from '../../consortium/controllers/messageController.js';
import { ProposalController as WebsiteProposalController } from '../../consortium/controllers/proposalController.js';
import { RealtimeController } from '../../consortium/controllers/realtimeController.js';
import { ProposalController as ClientProposalController } from '../../client/controllers/proposalController.js';

import { SystemService } from '../../admin/services/systemService.js';
import { UserService } from '../../admin/services/userService.js';
import { ErrorService } from '../../admin/services/errorService.js';
import { OrchestratorService } from '../../admin/services/orchestratorService.js';
import { AuditService } from '../../admin/services/auditService.js';
import { RealtimeService } from '../../consortium/services/realtimeService.js';
import { ProposalService as ClientProposalService } from '../../client/services/proposalService.js';

type ServiceMap = {
  // Admin Services
  systemService: SystemService;
  userService: UserService;
  adminErrorService: ErrorService;
  orchestratorService: OrchestratorService;
  auditService: AuditService;

  // Website Services
  realtimeService: RealtimeService;

  // Client Services
  clientProposalService: ClientProposalService;
};

type ControllerMap = {
  // Shared Controllers
  healthController: HealthController;
  webhookController: WebhookController;
  errorController: ErrorController;

  // Admin Controllers
  systemController: SystemController;
  userController: UserController;
  adminErrorController: AdminErrorController;
  orchestratorController: OrchestratorController;
  auditController: AuditController;

  // Website Controllers
  topicController: TopicController;
  messageController: MessageController;
  websiteProposalController: WebsiteProposalController;
  realtimeController: RealtimeController;

  // Client Controllers
  clientProposalController: ClientProposalController;
};

type ContainerRegistry = ServiceMap & ControllerMap;

/**
 * Singleton Dependency Injection Container
 * Manages all service and controller instances with proper lifecycle
 */
export class Container {
  private static instance: Container;
  private registry: Map<keyof ContainerRegistry, any> = new Map();
  private initialized = false;

  private constructor() {}

  /**
   * Get the singleton container instance
   */
  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  /**
   * Initialize the container with all services and controllers
   * Services are initialized first, then controllers receive service dependencies
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.warn('⚠️  Container already initialized');
      return;
    }

    console.log('🔧 Initializing Dependency Injection Container...');

    // Initialize Services (no dependencies)
    this.registry.set('systemService', new SystemService());
    this.registry.set('userService', new UserService());
    this.registry.set('adminErrorService', new ErrorService());
    this.registry.set('orchestratorService', new OrchestratorService());
    this.registry.set('auditService', new AuditService());
    this.registry.set('realtimeService', new RealtimeService());
    this.registry.set('clientProposalService', new ClientProposalService());

    // Initialize Controllers (with service dependencies)
    this.registry.set('healthController', new HealthController());
    this.registry.set('webhookController', new WebhookController());
    this.registry.set('errorController', new ErrorController(this.get('adminErrorService')));
    this.registry.set('systemController', new SystemController());
    this.registry.set('userController', new UserController());
    this.registry.set('adminErrorController', new AdminErrorController());
    this.registry.set('orchestratorController', new OrchestratorController());
    this.registry.set('auditController', new AuditController(this.get('auditService')));
    this.registry.set('topicController', new TopicController());
    this.registry.set('messageController', new MessageController());
    this.registry.set('websiteProposalController', new WebsiteProposalController());
    this.registry.set('realtimeController', new RealtimeController(this.get('realtimeService')));
    this.registry.set('clientProposalController', new ClientProposalController(this.get('clientProposalService')));

    this.initialized = true;
    console.log('✅ Container initialized with', this.registry.size, 'instances');
  }

  /**
   * Get a service or controller from the container
   * @throws {Error} If the key doesn't exist or container not initialized
   */
  get<K extends keyof ContainerRegistry>(key: K): ContainerRegistry[K] {
    if (!this.initialized) {
      throw new Error('Container not initialized. Call initialize() first.');
    }

    const instance = this.registry.get(key);
    if (!instance) {
      throw new Error(`Instance '${key}' not found in container`);
    }

    return instance;
  }

  /**
   * Check if an instance exists in the container
   */
  has(key: keyof ContainerRegistry): boolean {
    return this.registry.has(key);
  }

  /**
   * Cleanup hook for graceful shutdown
   * Can be extended to call cleanup methods on services
   */
  async cleanup(): Promise<void> {
    console.log('🧹 Cleaning up container...');

    // Cleanup realtime service connections
    const realtimeService = this.get('realtimeService');
    await realtimeService.cleanup();

    console.log('✅ Container cleanup complete');
  }

  /**
   * Reset the container (useful for testing)
   * @internal
   */
  reset(): void {
    this.registry.clear();
    this.initialized = false;
  }
}

/**
 * Get the singleton container instance
 * Convenience export for common usage
 */
export const getContainer = (): Container => Container.getInstance();
