const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { query } = require('../database/connection');

const router = express.Router();

// Handle Stripe webhooks
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;
      case 'transfer.created':
        await handleTransferCreated(event.data.object);
        break;
      case 'transfer.failed':
        await handleTransferFailed(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// Handle successful payment intent
async function handlePaymentIntentSucceeded(paymentIntent) {
  try {
    const transferId = paymentIntent.metadata.transfer_id;
    
    if (!transferId) {
      console.log('No transfer ID in payment intent metadata');
      return;
    }

    // Update transfer status
    await query(`
      UPDATE transfers 
      SET status = 'processing' 
      WHERE id = $1
    `, [transferId]);

    console.log(`Transfer ${transferId} marked as processing`);

    // Log compliance event
    await query(`
      INSERT INTO compliance_logs (entity_type, entity_id, action, details)
      VALUES ($1, $2, $3, $4)
    `, ['transfer', transferId, 'payment_succeeded', {
      stripe_payment_intent_id: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency
    }]);

  } catch (error) {
    console.error('Error handling payment intent succeeded:', error);
  }
}

// Handle failed payment intent
async function handlePaymentIntentFailed(paymentIntent) {
  try {
    const transferId = paymentIntent.metadata.transfer_id;
    
    if (!transferId) {
      console.log('No transfer ID in payment intent metadata');
      return;
    }

    // Update transfer status
    await query(`
      UPDATE transfers 
      SET status = 'failed' 
      WHERE id = $1
    `, [transferId]);

    console.log(`Transfer ${transferId} marked as failed`);

    // Log compliance event
    await query(`
      INSERT INTO compliance_logs (entity_type, entity_id, action, details)
      VALUES ($1, $2, $3, $4)
    `, ['transfer', transferId, 'payment_failed', {
      stripe_payment_intent_id: paymentIntent.id,
      failure_reason: paymentIntent.last_payment_error?.message || 'Unknown error'
    }]);

  } catch (error) {
    console.error('Error handling payment intent failed:', error);
  }
}

// Handle successful transfer
async function handleTransferCreated(transfer) {
  try {
    const transferId = transfer.metadata?.transfer_id;
    
    if (!transferId) {
      console.log('No transfer ID in transfer metadata');
      return;
    }

    // Update transfer status and add Stripe transfer ID
    await query(`
      UPDATE transfers 
      SET status = 'completed', stripe_transfer_id = $1 
      WHERE id = $2
    `, [transfer.id, transferId]);

    // Update trust balance
    const transferResult = await query(`
      SELECT amount, trust_id FROM transfers WHERE id = $1
    `, [transferId]);

    if (transferResult.rows.length > 0) {
      const { amount, trust_id } = transferResult.rows[0];
      
      await query(`
        UPDATE trust_accounts 
        SET current_balance = current_balance - $1 
        WHERE id = $2
      `, [amount, trust_id]);
    }

    console.log(`Transfer ${transferId} completed successfully`);

    // Log compliance event
    await query(`
      INSERT INTO compliance_logs (entity_type, entity_id, action, details)
      VALUES ($1, $2, $3, $4)
    `, ['transfer', transferId, 'transfer_completed', {
      stripe_transfer_id: transfer.id,
      amount: transfer.amount / 100,
      currency: transfer.currency
    }]);

  } catch (error) {
    console.error('Error handling transfer created:', error);
  }
}

// Handle failed transfer
async function handleTransferFailed(transfer) {
  try {
    const transferId = transfer.metadata?.transfer_id;
    
    if (!transferId) {
      console.log('No transfer ID in transfer metadata');
      return;
    }

    // Update transfer status
    await query(`
      UPDATE transfers 
      SET status = 'failed' 
      WHERE id = $1
    `, [transferId]);

    console.log(`Transfer ${transferId} failed`);

    // Log compliance event
    await query(`
      INSERT INTO compliance_logs (entity_type, entity_id, action, details)
      VALUES ($1, $2, $3, $4)
    `, ['transfer', transferId, 'transfer_failed', {
      stripe_transfer_id: transfer.id,
      failure_reason: transfer.failure_message || 'Unknown error'
    }]);

  } catch (error) {
    console.error('Error handling transfer failed:', error);
  }
}

module.exports = router;
