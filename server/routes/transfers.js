const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../database/connection');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Initiate wealth transfer
router.post('/', authenticateToken, [
  body('trustId').isUUID().withMessage('Valid trust ID is required'),
  body('beneficiaryId').isUUID().withMessage('Valid beneficiary ID is required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('currency').optional().isLength({ min: 3, max: 3 }),
  body('transferType').isIn(['inheritance', 'distribution', 'gift', 'charitable']),
  body('description').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      trustId, beneficiaryId, amount, currency = 'USD', 
      transferType, description 
    } = req.body;
    const userId = req.user.userId;

    // Verify trust belongs to user
    const trustResult = await query(`
      SELECT * FROM trust_accounts 
      WHERE id = $1 AND user_id = $2
    `, [trustId, userId]);

    if (trustResult.rows.length === 0) {
      return res.status(404).json({ error: 'Trust account not found' });
    }

    const trust = trustResult.rows[0];

    // Check if trust has sufficient balance
    if (trust.current_balance < amount) {
      return res.status(400).json({ error: 'Insufficient trust balance' });
    }

    // Verify beneficiary belongs to trust
    const beneficiaryResult = await query(`
      SELECT * FROM beneficiaries 
      WHERE id = $1 AND trust_id = $2
    `, [beneficiaryId, trustId]);

    if (beneficiaryResult.rows.length === 0) {
      return res.status(404).json({ error: 'Beneficiary not found' });
    }

    const beneficiary = beneficiaryResult.rows[0];

    // Create transfer record
    const transferResult = await query(`
      INSERT INTO transfers (
        trust_id, beneficiary_id, amount, currency, transfer_type, 
        description, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, 'pending')
      RETURNING *
    `, [trustId, beneficiaryId, amount, currency, transferType, description]);

    const transfer = transferResult.rows[0];

    try {
      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        metadata: {
          transfer_id: transfer.id,
          trust_id: trustId,
          beneficiary_id: beneficiaryId,
          transfer_type: transferType
        },
        description: `${transferType} transfer to ${beneficiary.first_name} ${beneficiary.last_name}`,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // Update transfer with Stripe payment intent ID
      await query(`
        UPDATE transfers 
        SET stripe_payment_intent_id = $1 
        WHERE id = $2
      `, [paymentIntent.id, transfer.id]);

      res.status(201).json({
        message: 'Transfer initiated successfully',
        transfer: {
          id: transfer.id,
          amount,
          currency,
          transferType,
          status: 'pending',
          stripePaymentIntentId: paymentIntent.id,
          clientSecret: paymentIntent.client_secret
        }
      });

    } catch (stripeError) {
      // If Stripe fails, mark transfer as failed
      await query(`
        UPDATE transfers 
        SET status = 'failed' 
        WHERE id = $1
      `, [transfer.id]);

      throw stripeError;
    }

  } catch (error) {
    console.error('Initiate transfer error:', error);
    if (error.type === 'StripeCardError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get transfers for a trust
router.get('/trust/:trustId', authenticateToken, async (req, res) => {
  try {
    const { trustId } = req.params;
    const userId = req.user.userId;

    // Verify trust belongs to user
    const trustResult = await query(`
      SELECT id FROM trust_accounts 
      WHERE id = $1 AND user_id = $2
    `, [trustId, userId]);

    if (trustResult.rows.length === 0) {
      return res.status(404).json({ error: 'Trust account not found' });
    }

    // Get transfers with beneficiary details
    const result = await query(`
      SELECT t.*, b.first_name, b.last_name, b.email
      FROM transfers t
      JOIN beneficiaries b ON t.beneficiary_id = b.id
      WHERE t.trust_id = $1
      ORDER BY t.created_at DESC
    `, [trustId]);

    const transfers = result.rows.map(transfer => ({
      id: transfer.id,
      amount: transfer.amount,
      currency: transfer.currency,
      transferType: transfer.transfer_type,
      status: transfer.status,
      description: transfer.description,
      beneficiaryName: `${transfer.first_name} ${transfer.last_name}`,
      beneficiaryEmail: transfer.email,
      createdAt: transfer.created_at,
      updatedAt: transfer.updated_at
    }));

    res.json({ transfers });

  } catch (error) {
    console.error('Get transfers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get transfer details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Get transfer with trust and beneficiary details
    const result = await query(`
      SELECT t.*, tr.trust_name, b.first_name, b.last_name, b.email
      FROM transfers t
      JOIN trust_accounts tr ON t.trust_id = tr.id
      JOIN beneficiaries b ON t.beneficiary_id = b.id
      WHERE t.id = $1 AND tr.user_id = $2
    `, [id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transfer not found' });
    }

    const transfer = result.rows[0];

    res.json({
      transfer: {
        id: transfer.id,
        amount: transfer.amount,
        currency: transfer.currency,
        transferType: transfer.transfer_type,
        status: transfer.status,
        description: transfer.description,
        trustName: transfer.trust_name,
        beneficiaryName: `${transfer.first_name} ${transfer.last_name}`,
        beneficiaryEmail: transfer.email,
        stripeTransferId: transfer.stripe_transfer_id,
        stripePaymentIntentId: transfer.stripe_payment_intent_id,
        complianceApproved: transfer.compliance_approved,
        complianceNotes: transfer.compliance_notes,
        createdAt: transfer.created_at,
        updatedAt: transfer.updated_at
      }
    });

  } catch (error) {
    console.error('Get transfer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel transfer
router.post('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Verify transfer belongs to user's trust
    const transferResult = await query(`
      SELECT t.* FROM transfers t
      JOIN trust_accounts tr ON t.trust_id = tr.id
      WHERE t.id = $1 AND tr.user_id = $2
    `, [id, userId]);

    if (transferResult.rows.length === 0) {
      return res.status(404).json({ error: 'Transfer not found' });
    }

    const transfer = transferResult.rows[0];

    if (transfer.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending transfers can be cancelled' });
    }

    // Cancel Stripe payment intent if it exists
    if (transfer.stripe_payment_intent_id) {
      try {
        await stripe.paymentIntents.cancel(transfer.stripe_payment_intent_id);
      } catch (stripeError) {
        console.error('Stripe cancel error:', stripeError);
      }
    }

    // Update transfer status
    await query(`
      UPDATE transfers 
      SET status = 'cancelled' 
      WHERE id = $1
    `, [id]);

    res.json({ message: 'Transfer cancelled successfully' });

  } catch (error) {
    console.error('Cancel transfer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
