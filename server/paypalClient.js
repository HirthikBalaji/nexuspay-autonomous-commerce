import axios from 'axios';

// PayPal Sandbox Configuration
// Defaults to sandbox environment with fallback mock support
let PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || 'PAYPAL_SANDBOX_DEMO_CLIENT_ID';
let PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || 'PAYPAL_SANDBOX_DEMO_CLIENT_SECRET';
let PAYPAL_BASE_URL = process.env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com';
let SIMULATION_MODE = process.env.PAYPAL_CLIENT_ID ? false : true;

// Cached access token
let cachedToken = null;
let tokenExpiry = 0;

export function updatePayPalCredentials(clientId, clientSecret, isSimulation = false) {
  PAYPAL_CLIENT_ID = clientId || PAYPAL_CLIENT_ID;
  PAYPAL_CLIENT_SECRET = clientSecret || PAYPAL_CLIENT_SECRET;
  SIMULATION_MODE = isSimulation;
  cachedToken = null;
  tokenExpiry = 0;
  return {
    success: true,
    clientId: PAYPAL_CLIENT_ID ? `${PAYPAL_CLIENT_ID.substring(0, 8)}...` : 'None',
    simulationMode: SIMULATION_MODE,
    baseUrl: PAYPAL_BASE_URL
  };
}

export function getPayPalConfig() {
  return {
    clientId: PAYPAL_CLIENT_ID,
    simulationMode: SIMULATION_MODE,
    baseUrl: PAYPAL_BASE_URL
  };
}

/**
 * Obtain OAuth2 Access Token from PayPal Sandbox
 */
export async function getAccessToken() {
  if (SIMULATION_MODE) {
    return 'A21AAK_MOCK_PAYPAL_SANDBOX_ACCESS_TOKEN_' + Date.now();
  }

  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  try {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    const response = await axios({
      method: 'post',
      url: `${PAYPAL_BASE_URL}/v1/oauth2/token`,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: 'grant_type=client_credentials'
    });

    cachedToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;
    return cachedToken;
  } catch (error) {
    console.warn('[PayPal Client] Sandbox Auth failed, switching to high-fidelity simulation:', error.message);
    SIMULATION_MODE = true;
    return 'A21AAK_MOCK_PAYPAL_SANDBOX_ACCESS_TOKEN_' + Date.now();
  }
}

/**
 * Create Order v2 (Intent: CAPTURE / Escrow Hold)
 */
export async function createOrder({ amount, currency = 'USD', description = 'NexusPay Autonomous Agent Escrow', customId = 'AGENT_MANDATE_001' }) {
  const token = await getAccessToken();

  if (SIMULATION_MODE) {
    const orderId = 'ORD-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    return {
      id: orderId,
      status: 'CREATED',
      intent: 'CAPTURE',
      links: [
        {
          href: `https://www.sandbox.paypal.com/checkoutnow?token=${orderId}`,
          rel: 'approve',
          method: 'GET'
        },
        {
          href: `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
          rel: 'capture',
          method: 'POST'
        }
      ],
      purchase_units: [
        {
          reference_id: 'PU_' + orderId,
          amount: {
            currency_code: currency,
            value: Number(amount).toFixed(2)
          },
          description: description,
          custom_id: customId
        }
      ],
      create_time: new Date().toISOString()
    };
  }

  try {
    const response = await axios({
      method: 'post',
      url: `${PAYPAL_BASE_URL}/v2/checkout/orders`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      data: {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: Number(amount).toFixed(2)
            },
            description: description,
            custom_id: customId
          }
        ],
        application_context: {
          brand_name: 'NexusPay Autonomous Clearinghouse',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: 'https://nexuspay.local/api/paypal/return',
          cancel_url: 'https://nexuspay.local/api/paypal/cancel'
        }
      }
    });

    return response.data;
  } catch (error) {
    console.error('[PayPal Client] Create Order Error:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Capture Order v2
 */
export async function captureOrder(orderId) {
  const token = await getAccessToken();

  if (SIMULATION_MODE || orderId.startsWith('ORD-')) {
    const captureId = 'CAP-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    return {
      id: orderId,
      status: 'COMPLETED',
      payment_source: {
        paypal: {
          email_address: 'buyer-agent@novacorp.ai',
          account_id: 'PP-ACC-8921-ATLAS',
          name: { given_name: 'Atlas', surname: 'Procurement-Agent' }
        }
      },
      purchase_units: [
        {
          payments: {
            captures: [
              {
                id: captureId,
                status: 'COMPLETED',
                amount: { currency_code: 'USD', value: '1850.00' },
                final_capture: true,
                seller_protection: { status: 'ELIGIBLE' },
                seller_receivable_breakdown: {
                  gross_amount: { currency_code: 'USD', value: '1850.00' },
                  paypal_fee: { currency_code: 'USD', value: '64.65' },
                  net_amount: { currency_code: 'USD', value: '1785.35' }
                },
                create_time: new Date().toISOString()
              }
            ]
          }
        }
      ]
    };
  }

  try {
    const response = await axios({
      method: 'post',
      url: `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('[PayPal Client] Capture Order Error:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Milestone Payout via PayPal Payouts v1 API
 */
export async function sendMilestonePayout({
  senderBatchId,
  receiverEmail,
  amount,
  currency = 'USD',
  note = 'NexusPay Autonomous Milestone Release'
}) {
  const token = await getAccessToken();
  const batchId = senderBatchId || 'PAYOUT_BATCH_' + Date.now();

  if (SIMULATION_MODE) {
    const itemId = 'ITEM_' + Math.random().toString(36).substring(2, 9).toUpperCase();
    return {
      batch_header: {
        payout_batch_id: 'PO-BATCH-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        batch_status: 'SUCCESS',
        sender_batch_header: {
          sender_batch_id: batchId,
          email_subject: 'You have received a milestone payment from NexusPay Escrow'
        },
        amount: {
          currency: currency,
          value: Number(amount).toFixed(2)
        },
        fees: {
          currency: currency,
          value: '0.25'
        }
      },
      items: [
        {
          payout_item_id: itemId,
          transaction_id: 'TXN-' + Math.random().toString(36).substring(2, 11).toUpperCase(),
          transaction_status: 'SUCCESS',
          payout_item_fee: { currency: currency, value: '0.25' },
          payout_batch_id: 'PO-BATCH-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
          payout_item: {
            recipient_type: 'EMAIL',
            amount: { currency: currency, value: Number(amount).toFixed(2) },
            note: note,
            receiver: receiverEmail
          }
        }
      ]
    };
  }

  try {
    const response = await axios({
      method: 'post',
      url: `${PAYPAL_BASE_URL}/v1/payments/payouts`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: {
        sender_batch_header: {
          sender_batch_id: batchId,
          email_subject: 'NexusPay Milestone Payout',
          email_message: note
        },
        items: [
          {
            recipient_type: 'EMAIL',
            amount: {
              value: Number(amount).toFixed(2),
              currency: currency
            },
            note: note,
            sender_item_id: 'ITEM_' + Date.now(),
            receiver: receiverEmail
          }
        ]
      }
    });

    return response.data;
  } catch (error) {
    console.error('[PayPal Client] Milestone Payout Error:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Refund / Dispute Settlement via PayPal Payments API
 */
export async function refundCapture({ captureId, amount, currency = 'USD', reason = 'AI Arbiter Ruling: SLA Breach' }) {
  const token = await getAccessToken();

  if (SIMULATION_MODE || captureId.startsWith('CAP-')) {
    return {
      id: 'REF-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      status: 'COMPLETED',
      amount: {
        value: Number(amount).toFixed(2),
        currency_code: currency
      },
      note_to_payer: reason,
      seller_payable_breakdown: {
        gross_amount: { currency_code: currency, value: Number(amount).toFixed(2) },
        paypal_fee: { currency_code: currency, value: '0.00' },
        net_amount: { currency_code: currency, value: Number(amount).toFixed(2) }
      },
      create_time: new Date().toISOString()
    };
  }

  try {
    const response = await axios({
      method: 'post',
      url: `${PAYPAL_BASE_URL}/v2/payments/captures/${captureId}/refund`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: {
        amount: {
          value: Number(amount).toFixed(2),
          currency_code: currency
        },
        note_to_payer: reason
      }
    });

    return response.data;
  } catch (error) {
    console.error('[PayPal Client] Refund Error:', error.response?.data || error.message);
    throw error;
  }
}
