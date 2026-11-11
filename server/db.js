import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default initial database state
const INITIAL_DB = {
  config: {
    paypalClientId: process.env.PAYPAL_CLIENT_ID || '',
    paypalClientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
    paypalBaseUrl: process.env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com',
    simulationMode: !process.env.PAYPAL_CLIENT_ID
  },
  treasury: {
    currency: 'USD',
    totalEscrowLocked: 4100.00,
    totalSettledVolume: 18450.00,
    disputedVolume: 3200.00,
    liquidVaultBalance: 84520.00,
    activeAgentsCount: 12,
    anomaliesCount: 2,
    arbitrationWinRate: '94.2%',
    averageSettlementLatency: '1.4s'
  },
  contracts: [],
  transactions: [
    {
      id: 'TXN-98214-PP',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      buyerAgent: 'Atlas-01 (NovaCorp)',
      supplierAgent: 'Hermes-09 (Aetheria)',
      category: 'GPU Cluster Compute',
      amount: 2150.00,
      currency: 'USD',
      milestoneStage: 'Escrow Locked',
      milestoneProgress: 0,
      riskScore: 12,
      slaHealth: 99.8,
      paypalReference: 'ORD-8921A4B9',
      agentStatus: 'ACTIVE',
      settlementRail: 'PayPal Orders v2'
    },
    {
      id: 'TXN-98213-PP',
      timestamp: new Date(Date.now() - 480000).toISOString(),
      buyerAgent: 'Atlas-01 (NovaCorp)',
      supplierAgent: 'Specter-04 (RedTeam)',
      category: 'Autonomous Red-Teaming',
      amount: 1950.00,
      currency: 'USD',
      milestoneStage: 'In Arbitration',
      milestoneProgress: 65,
      riskScore: 78,
      slaHealth: 84.2,
      paypalReference: 'REF-PENDING-THEMIS',
      agentStatus: 'FLAGGED',
      settlementRail: 'Themis AI Arbiter'
    },
    {
      id: 'TXN-98212-PP',
      timestamp: new Date(Date.now() - 950000).toISOString(),
      buyerAgent: 'Vector-02 (DataOps)',
      supplierAgent: 'Chronos-12 (Oracle Feed)',
      category: 'Real-time Oracle Latency',
      amount: 420.50,
      currency: 'USD',
      milestoneStage: 'Completed',
      milestoneProgress: 100,
      riskScore: 6,
      slaHealth: 99.99,
      paypalReference: 'PO-BATCH-892104',
      agentStatus: 'ACTIVE',
      settlementRail: 'PayPal Payouts v1'
    },
    {
      id: 'TXN-98211-PP',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      buyerAgent: 'Krypton-07 (Treasury)',
      supplierAgent: 'Nexus-Micro (Edge CDN)',
      category: 'Decentralized Edge Routing',
      amount: 860.00,
      currency: 'USD',
      milestoneStage: 'Tranche 2 Released',
      milestoneProgress: 66,
      riskScore: 18,
      slaHealth: 99.4,
      paypalReference: 'PO-BATCH-774129',
      agentStatus: 'ACTIVE',
      settlementRail: 'PayPal Payouts v1'
    },
    {
      id: 'TXN-98210-PP',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      buyerAgent: 'Apex-05 (SupplyChain)',
      supplierAgent: 'Logis-Bot (Freight AI)',
      category: 'Autonomous Multimodal Customs',
      amount: 3450.00,
      currency: 'USD',
      milestoneStage: 'Tranche 1 Released',
      milestoneProgress: 33,
      riskScore: 24,
      slaHealth: 98.7,
      paypalReference: 'PO-BATCH-661208',
      agentStatus: 'ACTIVE',
      settlementRail: 'PayPal Payouts v1'
    },
    {
      id: 'TXN-98209-PP',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      buyerAgent: 'Atlas-01 (NovaCorp)',
      supplierAgent: 'DeepCode-03 (Synthesizer)',
      category: 'Zero-Shot Code Generation',
      amount: 1100.00,
      currency: 'USD',
      milestoneStage: 'Completed',
      milestoneProgress: 100,
      riskScore: 8,
      slaHealth: 99.95,
      paypalReference: 'PO-BATCH-551982',
      agentStatus: 'ACTIVE',
      settlementRail: 'PayPal Payouts v1'
    },
    {
      id: 'TXN-98208-PP',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      buyerAgent: 'Sentinel-09 (RiskOps)',
      supplierAgent: 'Veritas-01 (Fact-Checker)',
      category: 'Regulatory Compliance Sweep',
      amount: 675.00,
      currency: 'USD',
      milestoneStage: 'Completed',
      milestoneProgress: 100,
      riskScore: 14,
      slaHealth: 99.2,
      paypalReference: 'PO-BATCH-441092',
      agentStatus: 'ACTIVE',
      settlementRail: 'PayPal Payouts v1'
    },
    {
      id: 'TXN-98207-PP',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      buyerAgent: 'Apex-05 (SupplyChain)',
      supplierAgent: 'Aetheria-Nodes',
      category: 'GPU Cluster Compute',
      amount: 4800.00,
      currency: 'USD',
      milestoneStage: 'Completed',
      milestoneProgress: 100,
      riskScore: 5,
      slaHealth: 99.98,
      paypalReference: 'PO-BATCH-330194',
      agentStatus: 'ACTIVE',
      settlementRail: 'PayPal Payouts v1'
    },
    {
      id: 'TXN-98206-PP',
      timestamp: new Date(Date.now() - 18000000).toISOString(),
      buyerAgent: 'Vector-02 (DataOps)',
      supplierAgent: 'Specter-04 (RedTeam)',
      category: 'Penetration Testing Fuzzing',
      amount: 1250.00,
      currency: 'USD',
      milestoneStage: 'Refunded (Arbitrated)',
      milestoneProgress: 100,
      riskScore: 88,
      slaHealth: 76.4,
      paypalReference: 'REF-330912-THEMIS',
      agentStatus: 'PAUSED',
      settlementRail: 'Themis AI Arbiter'
    },
    {
      id: 'TXN-98205-PP',
      timestamp: new Date(Date.now() - 21600000).toISOString(),
      buyerAgent: 'Krypton-07 (Treasury)',
      supplierAgent: 'Hermes-09 (Aetheria)',
      category: 'Micro-Batch Model Inference',
      amount: 320.00,
      currency: 'USD',
      milestoneStage: 'Completed',
      milestoneProgress: 100,
      riskScore: 10,
      slaHealth: 99.9,
      paypalReference: 'PO-BATCH-220194',
      agentStatus: 'ACTIVE',
      settlementRail: 'PayPal Payouts v1'
    }
  ],
  webhooks: [
    {
      id: 'WH-EVT-001',
      event_type: 'CHECKOUT.ORDER.APPROVED',
      resource_type: 'checkout-order',
      summary: 'Autonomous order approved by NovaCorp Agent Vault',
      create_time: new Date(Date.now() - 3600000).toISOString(),
      status: 'PROCESSED'
    },
    {
      id: 'WH-EVT-002',
      event_type: 'PAYMENT.CAPTURE.COMPLETED',
      resource_type: 'capture',
      summary: 'Escrow lock authorized for $2,150.00 USD',
      create_time: new Date(Date.now() - 3500000).toISOString(),
      status: 'PROCESSED'
    },
    {
      id: 'WH-EVT-003',
      event_type: 'PAYMENT.PAYOUTSBATCH.SUCCESS',
      resource_type: 'payouts',
      summary: 'Milestone 1 payout of $537.50 released to Hermes Agent',
      create_time: new Date(Date.now() - 1800000).toISOString(),
      status: 'PROCESSED'
    }
  ]
};

// Memory cache
let cachedDb = null;

export function getDb() {
  if (cachedDb) return cachedDb;

  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      cachedDb = JSON.parse(raw);
    } else {
      cachedDb = JSON.parse(JSON.stringify(INITIAL_DB));
      saveDb(cachedDb);
    }
  } catch (err) {
    console.error('[DB] Error loading database, initializing defaults:', err.message);
    cachedDb = JSON.parse(JSON.stringify(INITIAL_DB));
  }

  return cachedDb;
}

export function saveDb(data) {
  cachedDb = data;
  try {
    const tmpFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tmpFile, DB_FILE);
  } catch (err) {
    console.error('[DB] Atomic save failed:', err.message);
  }
}

// Helper accessors
export function getDbConfig() {
  return getDb().config;
}

export function updateDbConfig(updates) {
  const db = getDb();
  db.config = { ...db.config, ...updates };
  saveDb(db);
  return db.config;
}

export function getDbTransactions() {
  return getDb().transactions;
}

export function addDbTransaction(txn) {
  const db = getDb();
  db.transactions.unshift(txn);
  saveDb(db);
  return txn;
}

export function updateDbTransaction(id, updates) {
  const db = getDb();
  const index = db.transactions.findIndex(t => t.id === id);
  if (index !== -1) {
    db.transactions[index] = { ...db.transactions[index], ...updates };
    saveDb(db);
    return db.transactions[index];
  }
  return null;
}

export function getDbTreasury() {
  return getDb().treasury;
}

export function updateDbTreasury(updates) {
  const db = getDb();
  db.treasury = { ...db.treasury, ...updates };
  saveDb(db);
  return db.treasury;
}

export function getDbWebhooks() {
  return getDb().webhooks;
}

export function addDbWebhook(event) {
  const db = getDb();
  db.webhooks.unshift(event);
  if (db.webhooks.length > 100) {
    db.webhooks = db.webhooks.slice(0, 100);
  }
  saveDb(db);
  return event;
}

export function saveDbContract(contract) {
  const db = getDb();
  if (!db.contracts) db.contracts = [];
  const index = db.contracts.findIndex(c => c.contractId === contract.contractId);
  if (index !== -1) {
    db.contracts[index] = contract;
  } else {
    db.contracts.unshift(contract);
  }
  saveDb(db);
  return contract;
}

export function getDbContract(contractId) {
  const db = getDb();
  return db.contracts?.find(c => c.contractId === contractId) || null;
}
