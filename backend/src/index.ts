import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import { Orchestrator } from './orchestrator/index.js';

dotenv.config();

// Validate required environment variables
function validateEnvironment(): void {
  const required = [
    'SUPABASE_URL',
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
app.use(express.json({ limit: '1mb' })); // Limit request body size to 1MB

app.use('/api', apiRoutes);

app.post('/webhook/proposal', async (req, res) => {
  try {
    const { proposal_id } = req.body;

    if (!proposal_id) {
      return res.status(400).json({ error: 'proposal_id required' });
    }

    console.log(`📨 Webhook received for proposal: ${proposal_id}`);

    if (orchestrator) {
      await orchestrator.handleNewProposal(proposal_id);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/health', async (req, res) => {
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
