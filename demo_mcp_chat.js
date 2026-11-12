import dotenv from 'dotenv';
dotenv.config();
import { runAutonomousProcurementWorkflow } from './server/agentOrchestrator.js';

async function runMcpDemo(userInstruction) {
  const prompt = userInstruction || 'procure a laptop with high gpu for best price';

  console.log('\n================================================================');
  console.log('🤖 [NexusPay Autonomous Agent] User Mandate:');
  console.log(`"${prompt}"`);
  console.log('================================================================\n');

  console.log('⚡ Initializing Multi-Stage Autonomous Procurement Pipeline...');
  const startTime = Date.now();
  const res = await runAutonomousProcurementWorkflow({ prompt });

  console.log(`\n🎉 ${res.summary}\n`);
  console.log(`• Total Target Budget: $${res.totalBudget?.toLocaleString()} USD`);
  console.log(`• Agreed Settlement:   $${res.agreedAmount?.toLocaleString()} USD`);
  console.log(`• Total Savings:       +$${res.totalSavings?.toLocaleString()} USD`);
  console.log(`• Payment Status:      ${res.paymentStatus} (100% Settled)\n`);

  console.log('----------------------------------------------------------------');
  console.log('📋 AUDITABLE STEP-BY-STEP EXECUTION TRACE:');
  console.log('----------------------------------------------------------------\n');

  res.steps.forEach((s) => {
    console.log(`[STEP ${s.stepIndex}] ${s.title}`);
    console.log(`Status:   ✅ ${s.status} (${s.badge})`);
    console.log(`Summary:  ${s.summary}`);

    if (s.vendorComparison) {
      console.log('Vendor Benchmarks:');
      s.vendorComparison.forEach((v) => {
        const flag = v.vendor === s.selectedVendor ? '⭐ [WINNER]' : '  ';
        console.log(`  ${flag} ${v.model} (${v.vendor}) - $${v.initialPrice?.toLocaleString()} | ${v.gpu}`);
      });
    }

    if (s.rounds) {
      console.log('LLM Negotiation Transcript:');
      s.rounds.forEach((r) => {
        console.log(`  • Round ${r.round} [${r.sender}]: "${r.message}"`);
      });
    }

    if (s.paypalOrderId) {
      console.log(`PayPal Order ID:   ${s.paypalOrderId} (Status: ${s.orderStatus})`);
      console.log(`PayPal Capture ID: ${s.captureId}`);
    }

    if (s.attestation) {
      console.log(`Serial Seal:       ${s.attestation.serialNumber}`);
      console.log(`AirWayBill:        ${s.attestation.carrierTracking}`);
      console.log(`Merkle Root:       ${s.attestation.merkleRoot}`);
    }

    if (s.payoutBatchId) {
      console.log(`Payout Batch ID:   ${s.payoutBatchId} (Status: ${s.payoutStatus})`);
      console.log(`Disbursed To:      ${s.receiverEmail}`);
      console.log(`PayPal Link:       ${s.paypalResourceUrl}`);
    }
    console.log('');
  });

  console.log(`⏱️ Total Pipeline Execution Latency: ${Date.now() - startTime}ms`);
  console.log('================================================================\n');
}

const arg = process.argv.slice(2).join(' ');
runMcpDemo(arg);
