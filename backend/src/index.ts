import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import systemRoutes from './routes/system.js';
import errorsRoutes from './routes/errors.js';
import { Orchestrator } from './orchestrator/index.js';
import { createRateLimit } from './middleware/validation.js';

dotenv.config();

// Validate required environment variables
function validateEnvironment(): void {
  const required = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'ANTHROPIC_API_KEY',
    'OPENAI_API_KEY',
    'GROK_API_KEY',
    'GEMINI_API_KEY',
    'DEEPSEEK_API_KEY',
    'QWEN_API_KEY'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('\n❌ ERROR: Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\nPlease check your .env file and ensure all required keys are set.\n');
    process.exit(1);
  }

  const optional = ['ADMIN_WHITELISTED_IPS'];
  const missingOptional = optional.filter(key => !process.env[key]);

  if (missingOptional.length > 0) {
    console.warn('⚠️  Optional environment variables not set:');
    missingOptional.forEach(key => console.warn(`   - ${key}`));
    console.warn('   Admin endpoints will require IP whitelist configuration.\n');
  }

  console.log('✅ All required environment variables are set');
}

validateEnvironment();

const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS with environment-based origins
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:4173'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' data:; " +
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co; " +
    "frame-ancestors 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self'"
  );
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(express.json({ limit: '1mb' })); // Limit request body size to 1MB

app.use('/api', apiRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/errors', errorsRoutes);

app.post('/webhook/proposal', createRateLimit('POST:/webhook/proposal'), async (req, res) => {
  try {
    const { proposal_id } = req.body;

    if (!proposal_id) {
      return res.status(400).json({ error: 'proposal_id required' });
    }

    console.log(`📨 Webhook received for proposal: ${proposal_id}`);

    if (!orchestrator) {
      console.error('⚠️  Orchestrator not initialized');
      return res.status(503).json({ error: 'Service not ready' });
    }

    try {
      await orchestrator.handleNewProposal(proposal_id);
      res.json({
        success: true,
        message: 'Proposal received and queued for processing'
      });
    } catch (error) {
      console.error(`❌ Error handling proposal ${proposal_id}:`, error);

      if (error instanceof Error) {
        return res.status(500).json({
          error: 'Failed to process proposal',
          details: error.message
        });
      }

      throw error;
    }
  } catch (error) {
    console.error('💥 Webhook fatal error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred'
    });
  }
});

app.get('/health', createRateLimit('GET:/health'), async (req, res) => {
  try {
    const { SupabaseService } = await import('./services/supabase.js');
    const supabase = SupabaseService.getInstance();
    const dbHealth = await supabase.healthCheck();

    if (!dbHealth.healthy) {
      return res.status(503).json({
        status: 'unhealthy',
        database: dbHealth,
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      status: 'ok',
      database: { healthy: true },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(503).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/health/orchestrator', createRateLimit('GET:/health/orchestrator'), async (req, res) => {
  try {
    if (!orchestrator) {
      return res.json({
        status: 'not_initialized',
        isLeader: false,
        instanceId: null,
        lockStatus: null,
        timestamp: new Date().toISOString()
      });
    }

    const leadershipStatus = orchestrator.getLeadershipStatus();
    const lockStatus = await orchestrator.getLockStatus();

    res.json({
      status: 'ok',
      isLeader: leadershipStatus.isLeader,
      instanceId: leadershipStatus.instanceId,
      lockStatus: lockStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

let orchestrator: Orchestrator | null = null;

app.listen(PORT, async () => {
  console.log(`\n🌐 Server running on http://localhost:${PORT}`);
  console.log(`📡 Webhook endpoint: http://localhost:${PORT}/webhook/proposal`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health\n`);

  orchestrator = new Orchestrator();
  await orchestrator.start();
});

process.on('SIGINT', async () => {
  console.log('\n👋 Shutting down gracefully...');
  if (orchestrator) {
    await orchestrator.stop();
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n👋 Shutting down gracefully...');
  if (orchestrator) {
    await orchestrator.stop();
  }
  process.exit(0);
});
