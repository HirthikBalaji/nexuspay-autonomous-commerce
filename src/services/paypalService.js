import axios from 'axios';

const API_BASE = '/api';

export const paypalService = {
  async getCredentials() {
    const res = await axios.get(`${API_BASE}/paypal/credentials`);
    return res.data;
  },

  async updateCredentials(clientId, clientSecret, simulationMode) {
    const res = await axios.post(`${API_BASE}/paypal/credentials`, {
      clientId,
      clientSecret,
      simulationMode
    });
    return res.data;
  },

  async createOrder({ amount, currency, description, customId }) {
    const res = await axios.post(`${API_BASE}/paypal/create-order`, {
      amount,
      currency,
      description,
      customId
    });
    return res.data;
  },

  async captureOrder(orderId) {
    const res = await axios.post(`${API_BASE}/paypal/capture-order`, { orderId });
    return res.data;
  },

  async payoutMilestone({ senderBatchId, receiverEmail, amount, currency, note }) {
    const res = await axios.post(`${API_BASE}/paypal/payout-milestone`, {
      senderBatchId,
      receiverEmail,
      amount,
      currency,
      note
    });
    return res.data;
  },

  async refundDispute({ captureId, amount, currency, reason }) {
    const res = await axios.post(`${API_BASE}/paypal/refund-dispute`, {
      captureId,
      amount,
      currency,
      reason
    });
    return res.data;
  },

  async getWebhookEvents() {
    const res = await axios.get(`${API_BASE}/paypal/webhook-events`);
    return res.data;
  }
};
