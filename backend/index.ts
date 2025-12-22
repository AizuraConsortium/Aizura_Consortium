import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Orchestrator } from './shared/orchestrator/index.js';
import { ErrorLogger } from './shared/services/errorLogger.js';
import {
  REQUIRED_ENV_VARS,
  OPTIONAL_ENV_VARS,
  REQUEST_BODY_LIMIT,
  getAllowedOrigins,
  getServerPort,
  buildCSPHeader,
  buildHSTSHeader
} from './shared/config/server.js';

import sharedErrorRoutes from './shared/routes/errorRoutes.js';
import webhookRoutes, { webhookController } from './shared/routes/webhookRoutes.js';
import healthRoutes, { healthController } from './shared/routes/healthRoutes.js';
import adminErrorRoutes from './admin/routes/errorRoutes.js';
import adminSystemRoutes from './admin/routes/systemRoutes.js';
import adminUserRoutes from './admin/routes/userRoutes.js';
import adminOrchestratorRoutes, { orchestratorController } from './admin/routes/orchestratorRoutes.js';
import adminAuditRoutes from './admin/routes/auditRoutes.js';
import websiteTopicRoutes from './website/routes/topicRoutes.js';
import websiteMessageRoutes from './website/routes/messageRoutes.js';
import websiteProposalRoutes from './website/routes/proposalRoutes.js';
import websiteRealtimeRoutes, { realtimeService } from './website/routes/realtimeRoutes.js';
import clientProposalRoutes from './client/routes/proposalRoutes.js';

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
app.use('/health', healthRoutes);

/**
 * Webhook routes
 */
app.use('/webhook', webhookRoutes);

/**
 * Shared routes (public, rate-limited)
 */
app.use('/api/errors', sharedErrorRoutes);

/**
 * Admin routes (auth required)
 */
app.use('/api/admin/errors', adminErrorRoutes);
app.use('/api/admin/system', adminSystemRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/orchestrator', adminOrchestratorRoutes);
app.use('/api/admin/audit', adminAuditRoutes);

/**
 * Website routes (public)
 */
app.use('/api/website/topics', websiteTopicRoutes);
app.use('/api/website/messages', websiteMessageRoutes);
app.use('/api/website/proposals', websiteProposalRoutes);
app.use('/api/website/realtime', websiteRealtimeRoutes);

/**
 * Client routes (authenticated)
 */
app.use('/api/client/proposals', clientProposalRoutes);

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

    webhookController.setOrchestrator(orchestrator);
    healthController.setOrchestrator(orchestrator);
    orchestratorController.setOrchestrator(orchestrator);

    console.log('✅ Orchestrator initialized and controllers configured\n');
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
    await realtimeService.cleanup();
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
    await realtimeService.cleanup();
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
