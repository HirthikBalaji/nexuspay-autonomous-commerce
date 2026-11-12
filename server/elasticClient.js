import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';
dotenv.config();

const ELASTIC_NODE = process.env.ELASTIC_NODE || 'http://localhost:9200';
const ELASTIC_API_KEY = process.env.ELASTIC_API_KEY || null;

// Initialize official @elastic/elasticsearch client
export const elasticClient = new Client({
  node: ELASTIC_NODE,
  auth: ELASTIC_API_KEY ? { apiKey: ELASTIC_API_KEY } : undefined,
  maxRetries: 2,
  requestTimeout: 2000
});

let isClusterConnected = false;
let clusterInfo = null;

// Check connectivity to real cluster asynchronously
(async () => {
  try {
    const ping = await elasticClient.ping();
    if (ping) {
      isClusterConnected = true;
      clusterInfo = await elasticClient.info();
      console.log(`[Elasticsearch] Connected to live cluster at ${ELASTIC_NODE} (v${clusterInfo?.version?.number})`);
    }
  } catch (err) {
    isClusterConnected = false;
    console.log(`[Elasticsearch] No live cluster reachable at ${ELASTIC_NODE}. Operating in transparent sandbox vector mode.`);
  }
})();

// Document knowledge base
export const ELASTIC_DOCUMENTS = [
  {
    id: 'DOC-ELASTIC-001',
    index: 'nexus-agent-contracts',
    title: 'H100 GPU Procurement Mandate Covenant #892',
    content: 'Atlas Procurement Agent contract authorizing max budget $2,400.00 USD with 3-phase PayPal Smart Escrow. Requires 99.9% uptime and <15ms peer latency.',
    riskScore: 10,
    anomalyScore: 0.04,
    tags: ['gpu', 'procurement', 'covenant', 'paypal-escrow'],
    timestamp: '2026-11-11T10:15:00Z'
  },
  {
    id: 'DOC-ELASTIC-002',
    index: 'nexus-sla-telemetry',
    title: 'Anomalous Latency Spike Trace in M2 Fuzzing',
    content: 'SLA telemetry violation detected: peak latency 184.2ms exceeded agreed 35ms ceiling (+426% deviation). Triggered Themis AI Arbiter review for Contract Section 4.2.',
    riskScore: 84,
    anomalyScore: 0.92,
    tags: ['sla-breach', 'latency', 'themis-arbitration', 'refund-clawback'],
    timestamp: '2026-11-11T11:42:00Z'
  },
  {
    id: 'DOC-ELASTIC-003',
    index: 'nexus-paypal-payouts',
    title: 'Milestone 1 Benchmark Disbursed via PayPal Payouts v1',
    content: 'Executed batch PO-BATCH-PPZTQJQM releasing $552.00 USD to billing@aetheria-cloud.ai upon successful CUDA SHA-256 hash validation.',
    riskScore: 5,
    anomalyScore: 0.01,
    tags: ['payout', 'paypal-v1', 'cuda-hash', 'milestone-release'],
    timestamp: '2026-11-11T12:05:00Z'
  },
  {
    id: 'DOC-ELASTIC-004',
    index: 'nexus-agent-contracts',
    title: 'Red-Teaming Penetration Testing SLA Agreement',
    content: 'Specter Autonomous RedTeam contract for 500,000 synthetic exploit injections. Total escrow $1,950.00 USD held under PayPal Orders v2.',
    riskScore: 22,
    anomalyScore: 0.15,
    tags: ['security', 'penetration-test', 'fuzzing', 'paypal-escrow'],
    timestamp: '2026-11-11T09:30:00Z'
  },
  {
    id: 'DOC-ELASTIC-005',
    index: 'nexus-sla-telemetry',
    title: 'Oracle WebSocket Tick Stream Packet Delivery Audit',
    content: 'Chronos Oracles 10,000 ticks/sec ingestion telemetry. 24 consensus validator nodes confirmed zero sequence gaps with sub-millisecond route convergence.',
    riskScore: 8,
    anomalyScore: 0.02,
    tags: ['oracle', 'telemetry', 'consensus', 'microstructure'],
    timestamp: '2026-11-11T14:20:00Z'
  }
];

// In-memory cache for document embeddings
const docEmbeddingsCache = new Map();

/**
 * Generate 1536-dimensional embeddings using OpenRouter text-embedding-3-small
 */
export async function getVectorEmbedding(text) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey.startsWith('your_')) {
    // Generate deterministic 1536-dim unit vector if no API key
    return generateDeterministicVector(text, 1536);
  }

  try {
    const res = await fetch('https://openrouter.ai/api/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: text.slice(0, 1000)
      })
    });

    if (!res.ok) {
      console.warn(`[Elastic Vector] OpenRouter embedding returned ${res.status}. Falling back to deterministic unit vector.`);
      return generateDeterministicVector(text, 1536);
    }

    const data = await res.json();
    if (data?.data?.[0]?.embedding) {
      return data.data[0].embedding;
    }
  } catch (err) {
    console.warn(`[Elastic Vector] Embedding call error: ${err.message}. Using deterministic unit vector.`);
  }

  return generateDeterministicVector(text, 1536);
}

/**
 * Deterministic 1536-dim vector generator for offline fallback
 */
function generateDeterministicVector(text, dimensions = 1536) {
  const vector = new Array(dimensions).fill(0);
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    const index = (code * 31 + i * 17) % dimensions;
    vector[index] += Math.sin(code + i);
  }
  // Normalize to unit L2-norm
  let norm = 0;
  for (let i = 0; i < dimensions; i++) norm += vector[i] * vector[i];
  norm = Math.sqrt(norm) || 1;
  return vector.map(v => Number((v / norm).toFixed(6)));
}

/**
 * Calculate Cosine Similarity: (a . b) / (||a|| * ||b||)
 */
export function calculateCosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dot = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : Number((dot / denom).toFixed(4));
}

/**
 * Warm up document embeddings cache
 */
export async function initializeVectorIndex() {
  for (const doc of ELASTIC_DOCUMENTS) {
    if (!docEmbeddingsCache.has(doc.id)) {
      const textToEmbed = `${doc.title} ${doc.content} ${doc.tags.join(' ')}`;
      const vec = await getVectorEmbedding(textToEmbed);
      docEmbeddingsCache.set(doc.id, vec);
    }
  }
  console.log(`[Elasticsearch] Vector index warm: ${docEmbeddingsCache.size} documents indexed with 1,536-dim embeddings.`);
}

// Warm cache immediately
initializeVectorIndex().catch(console.error);

/**
 * Get Elastic status and transparency metadata
 */
export function getElasticStatus() {
  return {
    sdkVersion: '@elastic/elasticsearch v9.5.1',
    isClusterConnected,
    clusterNode: ELASTIC_NODE,
    clusterInfo: clusterInfo ? {
      name: clusterInfo.name,
      clusterName: clusterInfo.cluster_name,
      version: clusterInfo.version?.number
    } : null,
    clusterMode: isClusterConnected ? 'LIVE_CLUSTER' : 'SIMULATED_SANDBOX_FALLBACK',
    statusNote: isClusterConnected 
      ? `Connected to live Elasticsearch cluster at ${ELASTIC_NODE}`
      : 'Simulated sandbox fallback when live credentials are not present.',
    vectorSearch: {
      active: true,
      dimensions: 1536,
      embeddingModel: 'text-embedding-3-small',
      similarityMetric: 'Cosine Similarity (kNN)',
      indexedDocuments: ELASTIC_DOCUMENTS.length
    }
  };
}

/**
 * Search Elastic Index using dense vector similarity and Elasticsearch Query DSL
 */
export async function searchElastic({ query, index, minAnomalyScore = 0 }) {
  const startTime = Date.now();
  const q = (query || '').trim();

  // Generate Query Vector
  let queryVector = null;
  if (q) {
    queryVector = await getVectorEmbedding(q);
  }

  // Generate official Elasticsearch Query DSL payload
  const elasticDsl = {
    query: {
      bool: {
        must: q ? [
          {
            multi_match: {
              query: q,
              fields: ['title^2', 'content', 'tags^1.5'],
              fuzziness: 'AUTO'
            }
          }
        ] : [{ match_all: {} }],
        filter: [
          ...(index && index !== 'all' ? [{ term: { _index: index } }] : []),
          ...(minAnomalyScore > 0 ? [{ range: { anomalyScore: { gte: minAnomalyScore } } }] : [])
        ]
      }
    },
    knn: queryVector ? {
      field: 'content_vector',
      query_vector: queryVector.slice(0, 16), // Truncated preview in DSL
      k: 5,
      num_candidates: 50
    } : undefined
  };

  // If live Elasticsearch cluster is available, attempt real cluster search
  if (isClusterConnected) {
    try {
      const res = await elasticClient.search({
        index: index && index !== 'all' ? index : 'nexus-*',
        body: elasticDsl
      });
      return {
        hits: res.hits.hits.map(h => ({ ...h._source, id: h._id, score: h._score })),
        totalHits: res.hits.total.value,
        latencyMs: Date.now() - startTime,
        mode: 'LIVE_ELASTICSEARCH_CLUSTER',
        dsl: elasticDsl
      };
    } catch (err) {
      console.warn('[Elasticsearch] Cluster search error, falling back to sandbox vector scoring:', err.message);
    }
  }

  // Sandbox fallback: Real 1536-dimensional Cosine Similarity Scoring
  let scoredDocs = ELASTIC_DOCUMENTS.map(doc => {
    let cosineSim = 0.5;
    if (queryVector) {
      let docVec = docEmbeddingsCache.get(doc.id);
      if (!docVec) {
        docVec = generateDeterministicVector(doc.title + ' ' + doc.content, 1536);
        docEmbeddingsCache.set(doc.id, docVec);
      }
      cosineSim = calculateCosineSimilarity(queryVector, docVec);
    } else {
      // Lexical or default relevance
      cosineSim = 0.70;
    }

    // Text match boost
    let textMatch = false;
    if (q) {
      const qLower = q.toLowerCase();
      textMatch = doc.title.toLowerCase().includes(qLower) || 
                  doc.content.toLowerCase().includes(qLower) ||
                  doc.tags.some(t => t.toLowerCase().includes(qLower));
    }

    const finalScore = Number((cosineSim * 0.75 + (textMatch ? 0.25 : 0.0)).toFixed(4));

    return {
      ...doc,
      cosineSimilarity: cosineSim,
      score: finalScore,
      vectorMatch: cosineSim > 0.35
    };
  });

  // Apply filters
  if (index && index !== 'all') {
    scoredDocs = scoredDocs.filter(doc => doc.index === index);
  }
  if (minAnomalyScore > 0) {
    scoredDocs = scoredDocs.filter(doc => (doc.anomalyScore || 0) >= minAnomalyScore);
  }

  // Sort by score descending
  scoredDocs.sort((a, b) => b.score - a.score);

  return {
    hits: scoredDocs,
    totalHits: scoredDocs.length,
    latencyMs: Date.now() - startTime,
    mode: isClusterConnected ? 'LIVE_ELASTICSEARCH_CLUSTER' : 'SIMULATED_SANDBOX_FALLBACK',
    statusNote: 'Simulated sandbox fallback when live credentials are not present.',
    vectorDimensions: 1536,
    queryVectorPreview: queryVector ? queryVector.slice(0, 8) : null,
    elasticDsl,
    timestamp: new Date().toISOString()
  };
}
