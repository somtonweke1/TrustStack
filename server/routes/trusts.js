const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../database/connection');
const jwt = require('jsonwebtoken');

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

// Create new trust account
router.post('/', authenticateToken, [
  body('trustName').trim().notEmpty().withMessage('Trust name is required'),
  body('trustType').trim().notEmpty().withMessage('Trust type is required'),
  body('trustPurpose').optional().trim(),
  body('initialFundingAmount').optional().isFloat({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { trustName, trustType, trustPurpose, initialFundingAmount } = req.body;
    const userId = req.user.userId;

    // Create trust account
    const result = await query(`
      INSERT INTO trust_accounts (user_id, trust_name, trust_type, trust_purpose, initial_funding_amount, current_balance)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [userId, trustName, trustType, trustPurpose, initialFundingAmount || 0, initialFundingAmount || 0]);

    const trust = result.rows[0];

    res.status(201).json({
      message: 'Trust account created successfully',
      trust: {
        id: trust.id,
        trustName: trust.trust_name,
        trustType: trust.trust_type,
        trustPurpose: trust.trust_purpose,
        initialFundingAmount: trust.initial_funding_amount,
        currentBalance: trust.current_balance,
        status: trust.status,
        complianceStatus: trust.compliance_status,
        createdAt: trust.created_at
      }
    });

  } catch (error) {
    console.error('Create trust error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all trust accounts for current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await query(`
      SELECT * FROM trust_accounts 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `, [userId]);

    const trusts = result.rows.map(trust => ({
      id: trust.id,
      trustName: trust.trust_name,
      trustType: trust.trust_type,
      trustPurpose: trust.trust_purpose,
      initialFundingAmount: trust.initial_funding_amount,
      currentBalance: trust.current_balance,
      status: trust.status,
      complianceStatus: trust.compliance_status,
      createdAt: trust.created_at,
      updatedAt: trust.updated_at
    }));

    res.json({ trusts });

  } catch (error) {
    console.error('Get trusts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific trust account
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await query(`
      SELECT * FROM trust_accounts 
      WHERE id = $1 AND user_id = $2
    `, [id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Trust account not found' });
    }

    const trust = result.rows[0];

    // Get beneficiaries for this trust
    const beneficiariesResult = await query(`
      SELECT * FROM beneficiaries 
      WHERE trust_id = $1
    `, [id]);

    const beneficiaries = beneficiariesResult.rows.map(ben => ({
      id: ben.id,
      firstName: ben.first_name,
      lastName: ben.last_name,
      email: ben.email,
      relationship: ben.relationship,
      allocationPercentage: ben.allocation_percentage,
      kycStatus: ben.kyc_status
    }));

    res.json({
      trust: {
        id: trust.id,
        trustName: trust.trust_name,
        trustType: trust.trust_type,
        trustPurpose: trust.trust_purpose,
        initialFundingAmount: trust.initial_funding_amount,
        currentBalance: trust.current_balance,
        status: trust.status,
        complianceStatus: trust.compliance_status,
        createdAt: trust.created_at,
        updatedAt: trust.updated_at
      },
      beneficiaries
    });

  } catch (error) {
    console.error('Get trust error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update trust account
router.put('/:id', authenticateToken, [
  body('trustName').optional().trim().notEmpty(),
  body('trustPurpose').optional().trim(),
  body('status').optional().isIn(['active', 'suspended', 'closed'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const userId = req.user.userId;
    const updates = req.body;

    // Check if trust exists and belongs to user
    const existingTrust = await query(`
      SELECT id FROM trust_accounts 
      WHERE id = $1 AND user_id = $2
    `, [id, userId]);

    if (existingTrust.rows.length === 0) {
      return res.status(404).json({ error: 'Trust account not found' });
    }

    // Build update query dynamically
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (updates.trustName) {
      updateFields.push(`trust_name = $${++paramCount}`);
      values.push(updates.trustName);
    }
    if (updates.trustPurpose !== undefined) {
      updateFields.push(`trust_purpose = $${++paramCount}`);
      values.push(updates.trustPurpose);
    }
    if (updates.status) {
      updateFields.push(`status = $${++paramCount}`);
      values.push(updates.status);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    values.unshift(id, userId);
    const result = await query(`
      UPDATE trust_accounts 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `, values);

    const trust = result.rows[0];

    res.json({
      message: 'Trust account updated successfully',
      trust: {
        id: trust.id,
        trustName: trust.trust_name,
        trustType: trust.trust_type,
        trustPurpose: trust.trust_purpose,
        initialFundingAmount: trust.initial_funding_amount,
        currentBalance: trust.current_balance,
        status: trust.status,
        complianceStatus: trust.compliance_status,
        updatedAt: trust.updated_at
      }
    });

  } catch (error) {
    console.error('Update trust error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get trust account summary (for dashboard)
router.get('/:id/summary', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Get trust details
    const trustResult = await query(`
      SELECT * FROM trust_accounts 
      WHERE id = $1 AND user_id = $2
    `, [id, userId]);

    if (trustResult.rows.length === 0) {
      return res.status(404).json({ error: 'Trust account not found' });
    }

    const trust = trustResult.rows[0];

    // Get beneficiary count
    const beneficiaryCount = await query(`
      SELECT COUNT(*) FROM beneficiaries WHERE trust_id = $1
    `, [id]);

    // Get recent transfers
    const recentTransfers = await query(`
      SELECT * FROM transfers 
      WHERE trust_id = $1 
      ORDER BY created_at DESC 
      LIMIT 5
    `, [id]);

    // Get compliance status
    const complianceStatus = await query(`
      SELECT * FROM compliance_logs 
      WHERE entity_type = 'trust' AND entity_id = $1 
      ORDER BY created_at DESC 
      LIMIT 1
    `, [id]);

    res.json({
      summary: {
        trustId: trust.id,
        trustName: trust.trust_name,
        currentBalance: trust.current_balance,
        status: trust.status,
        complianceStatus: trust.compliance_status,
        beneficiaryCount: parseInt(beneficiaryCount.rows[0].count),
        recentTransfers: recentTransfers.rows.length,
        lastComplianceCheck: complianceStatus.rows[0]?.created_at || null
      }
    });

  } catch (error) {
    console.error('Get trust summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
