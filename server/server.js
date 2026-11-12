import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import paypalRoutes from './routes/paypalRoutes.js';
import agentRoutes from './routes/agentRoutes.js';
import telemetryRoutes from './routes/telemetryRoutes.js';
import sponsorRoutes from './routes/sponsorRoutes.js';
import paypalAgentTools from './routes/paypalAgentTools.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/paypal/agent-tools', paypalAgentTools);
app.use('/api/paypal', paypalRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api', sponsorRoutes);

// OpenAPI Spec endpoint for APIMatic and Postman
app.get('/api/docs/openapi.json', (req, res) => {
  const specPath = path.join(__dirname, 'openapi.json');
  if (fs.existsSync(specPath)) {
    res.sendFile(specPath);
  } else {
    res.status(404).json({ error: 'OpenAPI specification not found' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    protocol: 'NexusPay Autonomous Agent Commerce',
    version: '1.0.0',
    paypalMode: process.env.PAYPAL_CLIENT_ID ? 'LIVE_SANDBOX' : 'HIGH_FIDELITY_SIMULATION',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend in production
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // Universal SPA fallback for client-side routing
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
}

app.listen(PORT, () => {
  console.log(`🚀 [NexusPay Backend] Running on http://localhost:${PORT}`);
  console.log(`📡 [OpenAPI / APIMatic] http://localhost:${PORT}/api/docs/openapi.json`);
  console.log(`💳 [PayPal Gateway] Initialized in ${process.env.PAYPAL_CLIENT_ID ? 'LIVE_SANDBOX' : 'SIMULATION'} mode`);
});
