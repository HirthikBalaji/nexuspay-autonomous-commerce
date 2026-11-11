import axios from 'axios';

const API_BASE = '/api';

export const agentService = {
  async getScenarios() {
    const res = await axios.get(`${API_BASE}/agent/scenarios`);
    return res.data;
  },

  async negotiate({ scenarioId, customTask }) {
    const res = await axios.post(`${API_BASE}/agent/negotiate`, {
      scenarioId,
      customTask
    });
    return res.data;
  },

  async verifyMilestone({ contractId, milestoneIndex, deliverable, supplierWallet, amount, simulateFailure }) {
    const res = await axios.post(`${API_BASE}/agent/verify-milestone`, {
      contractId,
      milestoneIndex,
      deliverable,
      supplierWallet,
      amount,
      simulateFailure
    });
    return res.data;
  },

  async arbitrate({ contractId, disputeReason, agreedAmount, totalEscrowRemaining, captureId, breachEvidence }) {
    const res = await axios.post(`${API_BASE}/agent/arbitrate`, {
      contractId,
      disputeReason,
      agreedAmount,
      totalEscrowRemaining,
      captureId,
      breachEvidence
    });
    return res.data;
  },

  async getTransactions() {
    const res = await axios.get(`${API_BASE}/telemetry/transactions`);
    return res.data;
  },

  async simulateTelemetryTick() {
    const res = await axios.post(`${API_BASE}/telemetry/simulate-tick`);
    return res.data;
  },

  async triggerTelemetryAction(transactionId, action, reason) {
    const res = await axios.post(`${API_BASE}/telemetry/action`, {
      transactionId,
      action,
      reason
    });
    return res.data;
  },

  async getTreasuryStats() {
    const res = await axios.get(`${API_BASE}/telemetry/treasury`);
    return res.data;
  }
};
