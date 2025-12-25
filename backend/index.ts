import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Orchestrator } from './shared/orchestrator/Orchestrator.js';
import { ErrorLogger } from './shared/services/errorLogger.js';
import { Container } from './shared/infrastructure/Container.js';
import {
  REQUIRED_ENV_VARS,
  OPTIONAL_ENV_VARS,
  REQUEST_BODY_LIMIT,
  getAllowedOrigins,
  getServerPort,
  buildCSPHeader,
  buildHSTSHeader
} from './shared/config/server.js';

// Import route factory functions
import createSharedErrorRoutes from './shared/routes/errorRoutes.js';
import createWebhookRoutes from './shared/routes/webhookRoutes.js';
import createHealthRoutes from './shared/routes/healthRoutes.js';
import adminErrorRoutes from './admin/routes/errorRoutes.js';
import adminSystemRoutes from './admin/routes/systemRoutes.js';
import adminUserRoutes from './admin/routes/userRoutes.js';
import createOrchestratorRoutes from './admin/routes/orchestratorRoutes.js';
import createAuditRoutes from './admin/routes/auditRoutes.js';
import websiteTopicRoutes from './website/routes/topicRoutes.js';
import websiteMessageRoutes from './website/routes/messageRoutes.js';
import websiteProposalRoutes from './website/routes/proposalRoutes.js';
import createRealtimeRoutes from './website/routes/realtimeRoutes.js';
import clientProposalRoutes from './client/routes/proposalRoutes.js';
import clientNotificationRoutes from './client/routes/notificationRoutes.js';
import clientU2ERoutes from './client/routes/u2eRoutes.js';
import clientPortfolioRoutes from './client/routes/portfolioRoutes.js';
import clientAirdropRoutes from './client/routes/airdropRoutes.js';
import clientProfileRoutes from './client/routes/profileRoutes.js';
import clientNewsRoutes from './client/routes/newsRoutes.js';
import adminU2ERoutes from './admin/routes/u2eRoutes.js';
import adminBusinessRoutes from './admin/routes/businessRoutes.js';
import createU2EWebhookRoutes from './shared/routes/u2eWebhookRoutes.js';
import daoRoutes, { statsService, treasuryService, governanceService } from './website/dao/routes/index.js';
import { DAORepository } from './website/dao/repositories/daoRepository.js';
import { getGovernanceMetricsCaptureJob } from './shared/jobs/captureGovernanceMetrics.js';
import publicDaoRoutes from './dao/routes/daoRoutes.js';

dotenv.config();

const errorLogger = ErrorLogger.getInstance();

/**
 * Validates that all required environment variables are set
 * @throws {Error} Exits the process if required variables are missing
 */
function validateEnvironment(): void {
  const missing = REQUIRED_ENV_VARS.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('\n❌ ERROR: Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\nPlease check your .env file and ensure all required keys are set.\n');
    process.exit(1);
  }

  const missingOptional = OPTIONAL_ENV_VARS.filter(key => !process.env[key]);

  if (missingOptional.length > 0) {
    console.warn('⚠️  Optional environment variables not set:');
    missingOptional.forEach(key => console.warn(`   - ${key}`));
    console.warn('   Admin endpoints will require IP whitelist configuration.\n');
  }

  console.log('✅ All required environment variables are set');
}

validateEnvironment();

const app = express();
const PORT = getServerPort();
const allowedOrigins = getAllowedOrigins();

/**
 * Initialize the Dependency Injection Container
 * Must be done before route registration
 */
const container = Container.getInstance();
await container.initialize();

/**
 * Middleware to log requests without Origin header in production
 */
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (!origin && process.env.NODE_ENV === 'production') {
    const userAgent = req.get('user-agent')?.substring(0, 50) || 'none';
    console.warn(
      `⚠️  No-origin request: ${req.method} ${req.path} ` +
      `from ${req.ip || 'unknown'} UA: ${userAgent}`
    );

    errorLogger.logBackendError(
      'NO_ORIGIN_REQUEST',
      'Request received without Origin header in production',
      {
        requestPath: req.path,
        requestMethod: req.method,
        metadata: {
          ip: req.ip,
          userAgent
        }
      }
    ).catch(err => console.error('Failed to log no-origin request:', err));
  }

  next();
});

/**
 * CORS configuration middleware
 */
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️  Blocked origin: ${origin}`);

      errorLogger.logBackendError(
        'CORS_BLOCKED_ORIGIN',
        `CORS blocked origin: ${origin}`,
        {
          metadata: { origin }
        }
      ).catch(err => console.error('Failed to log CORS block:', err));

      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

/**
 * Security headers middleware
 */
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', buildHSTSHeader());
  }

  res.setHeader('Content-Security-Policy', buildCSPHeader());
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

/**
 * Request body parsing middleware
 */
app.use(express.json({ limit: REQUEST_BODY_LIMIT }));

/**
 * Health check routes (must be before other routes for proper prioritization)
 */
app.use('/health', createHealthRoutes());

/**
 * Webhook routes
 */
app.use('/webhook', createWebhookRoutes());
app.use('/webhook', createU2EWebhookRoutes());

/**
 * Shared routes (public, rate-limited)
 */
app.use('/api/errors', createSharedErrorRoutes());

/**
 * Admin routes (auth required)
 */
app.use('/api/admin/errors', adminErrorRoutes);
app.use('/api/admin/system', adminSystemRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/orchestrator', createOrchestratorRoutes());
app.use('/api/admin/audit', createAuditRoutes());
app.use('/api/admin/u2e', adminU2ERoutes);
app.use('/api/admin/businesses', adminBusinessRoutes);

/**
 * Website routes (public)
 */
app.use('/api/website/topics', websiteTopicRoutes);
app.use('/api/website/messages', websiteMessageRoutes);
app.use('/api/website/proposals', websiteProposalRoutes);
app.use('/api/website/realtime', createRealtimeRoutes());
app.use('/api/website/dao', daoRoutes);

/**
 * DAO routes (public)
 */
app.use('/api/dao', publicDaoRoutes);

/**
 * Client routes (authenticated)
 */
app.use('/api/client/proposals', clientProposalRoutes);
app.use('/api/client', clientNotificationRoutes);
app.use('/api/client/u2e', clientU2ERoutes);
app.use('/api/client/portfolio', clientPortfolioRoutes);
app.use('/api/client/airdrop', clientAirdropRoutes);
app.use('/api/client/profile', clientProfileRoutes);
app.use('/api/client/news', clientNewsRoutes);

/**
 * Global error handling middleware
 * This must be registered AFTER all routes
 */
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const errorMessage = err.message || 'An error occurred';
  const stackTrace = err.stack || '';
  const statusCode = err.statusCode || err.status || 500;

  console.error('💥 Unhandled error:', err);

  if (process.env.NODE_ENV === 'development') {
    console.error('Error stack:', stackTrace);
    console.error('Request:', {
      method: req.method,
      path: req.path,
      body: req.body,
      query: req.query
    });
  }

  errorLogger.logBackendError(
    'UNHANDLED_ERROR',
    `Unhandled error: ${errorMessage}`,
    {
      requestPath: req.path,
      requestMethod: req.method,
      stackTrace,
      metadata: {
        statusCode,
        body: req.body,
        query: req.query,
        errorDetails: err
      }
    }
  ).catch(logErr => console.error('Failed to log unhandled error:', logErr));

  if (process.env.NODE_ENV === 'production') {
    res.status(statusCode).json({
      error: statusCode === 500 ? 'Internal server error' : errorMessage
    });
  } else {
    res.status(statusCode).json({
      error: errorMessage,
      stack: stackTrace,
      details: err
    });
  }
});

let orchestrator: Orchestrator | null = null;
let governanceCaptureJob: any = null;

/**
 * Start the Express server and initialize the orchestrator
 */
app.listen(PORT, async () => {
  console.log(`\n🌐 Server running on http://localhost:${PORT}`);
  console.log(`📡 Webhook endpoint: http://localhost:${PORT}/webhook/proposal`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health\n`);

  try {
    orchestrator = new Orchestrator();
    await orchestrator.start();

    // Get controllers from container and configure with orchestrator
    const webhookController = container.get('webhookController');
    const healthController = container.get('healthController');
    const orchestratorController = container.get('orchestratorController');

    webhookController.setOrchestrator(orchestrator);
    healthController.setOrchestrator(orchestrator);
    orchestratorController.setOrchestrator(orchestrator);

    console.log('✅ Orchestrator initialized and controllers configured');

    // Initialize DAO services - warm cache
    console.log('🔥 Warming DAO cache...');
    await Promise.all([
      statsService.warmCache(),
      treasuryService.warmCache(),
      governanceService.warmCache(),
    ]);
    console.log('✅ DAO cache warmed successfully');

    // Start background job for governance metrics capture
    const daoRepo = new DAORepository('dao_statistics');
    governanceCaptureJob = getGovernanceMetricsCaptureJob(daoRepo);
    governanceCaptureJob.start();
    console.log('✅ Governance metrics capture job started\n');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const stackTrace = error instanceof Error ? error.stack : undefined;

    console.error('❌ Failed to initialize orchestrator:', error);

    await errorLogger.logBackendError(
      'ORCHESTRATOR_INITIALIZATION_ERROR',
      `Failed to initialize orchestrator: ${errorMessage}`,
      {
        stackTrace,
        metadata: { error: errorMessage }
      }
    );
  }
});

/**
 * Graceful shutdown handler for SIGINT
 */
process.on('SIGINT', async () => {
  console.log('\n👋 Shutting down gracefully...');

  try {
    if (orchestrator) {
      await orchestrator.stop();
    }
    // Stop governance metrics capture job
    if (governanceCaptureJob) {
      governanceCaptureJob.stop();
    }
    // Cleanup container (includes realtime service)
    await container.cleanup();
    console.log('✅ Graceful shutdown complete');
    process.exit(0);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error during shutdown:', errorMessage);

    await errorLogger.logBackendError(
      'SHUTDOWN_ERROR',
      `Error during graceful shutdown: ${errorMessage}`,
      {
        stackTrace: error instanceof Error ? error.stack : undefined
      }
    );

    process.exit(1);
  }
});

/**
 * Graceful shutdown handler for SIGTERM
 */
process.on('SIGTERM', async () => {
  console.log('\n👋 Shutting down gracefully...');

  try {
    if (orchestrator) {
      await orchestrator.stop();
    }
    // Stop governance metrics capture job
    if (governanceCaptureJob) {
      governanceCaptureJob.stop();
    }
    // Cleanup container (includes realtime service)
    await container.cleanup();
    console.log('✅ Graceful shutdown complete');
    process.exit(0);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error during shutdown:', errorMessage);

    await errorLogger.logBackendError(
      'SHUTDOWN_ERROR',
      `Error during graceful shutdown: ${errorMessage}`,
      {
        stackTrace: error instanceof Error ? error.stack : undefined
      }
    );

    process.exit(1);
  }
});
