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

// Add beneficiary to trust
router.post('/', authenticateToken, [
  body('trustId').isUUID().withMessage('Valid trust ID is required'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').optional().isEmail().normalizeEmail(),
  body('phone').optional().trim(),
  body('dateOfBirth').optional().isISO8601(),
  body('relationship').optional().trim(),
  body('allocationPercentage').optional().isFloat({ min: 0, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      trustId, firstName, lastName, email, phone, 
      dateOfBirth, relationship, allocationPercentage 
    } = req.body;
    const userId = req.user.userId;

    // Verify trust belongs to user
    const trustResult = await query(`
      SELECT id FROM trust_accounts 
      WHERE id = $1 AND user_id = $2
    `, [trustId, userId]);

    if (trustResult.rows.length === 0) {
      return res.status(404).json({ error: 'Trust account not found' });
    }

    // Create beneficiary
    const result = await query(`
      INSERT INTO beneficiaries (
        trust_id, first_name, last_name, email, phone, 
        date_of_birth, relationship, allocation_percentage
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [trustId, firstName, lastName, email, phone, dateOfBirth, relationship, allocationPercentage]);

    const beneficiary = result.rows[0];

    res.status(201).json({
      message: 'Beneficiary added successfully',
      beneficiary: {
        id: beneficiary.id,
        firstName: beneficiary.first_name,
        lastName: beneficiary.last_name,
        email: beneficiary.email,
        phone: beneficiary.phone,
        dateOfBirth: beneficiary.date_of_birth,
        relationship: beneficiary.relationship,
        allocationPercentage: beneficiary.allocation_percentage,
        kycStatus: beneficiary.kyc_status,
        createdAt: beneficiary.created_at
      }
    });

  } catch (error) {
    console.error('Add beneficiary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get beneficiaries for a trust
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

    // Get beneficiaries
    const result = await query(`
      SELECT * FROM beneficiaries 
      WHERE trust_id = $1 
      ORDER BY created_at DESC
    `, [trustId]);

    const beneficiaries = result.rows.map(ben => ({
      id: ben.id,
      firstName: ben.first_name,
      lastName: ben.last_name,
      email: ben.email,
      phone: ben.phone,
      dateOfBirth: ben.date_of_birth,
      relationship: ben.relationship,
      allocationPercentage: ben.allocation_percentage,
      kycStatus: ben.kyc_status,
      createdAt: ben.created_at
    }));

    res.json({ beneficiaries });

  } catch (error) {
    console.error('Get beneficiaries error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update beneficiary
router.put('/:id', authenticateToken, [
  body('firstName').optional().trim().notEmpty(),
  body('lastName').optional().trim().notEmpty(),
  body('email').optional().isEmail().normalizeEmail(),
  body('phone').optional().trim(),
  body('relationship').optional().trim(),
  body('allocationPercentage').optional().isFloat({ min: 0, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const userId = req.user.userId;
    const updates = req.body;

    // Verify beneficiary belongs to user's trust
    const beneficiaryResult = await query(`
      SELECT b.id FROM beneficiaries b
      JOIN trust_accounts t ON b.trust_id = t.id
      WHERE b.id = $1 AND t.user_id = $2
    `, [id, userId]);

    if (beneficiaryResult.rows.length === 0) {
      return res.status(404).json({ error: 'Beneficiary not found' });
    }

    // Build update query dynamically
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (updates.firstName) {
      updateFields.push(`first_name = $${++paramCount}`);
      values.push(updates.firstName);
    }
    if (updates.lastName) {
      updateFields.push(`last_name = $${++paramCount}`);
      values.push(updates.lastName);
    }
    if (updates.email !== undefined) {
      updateFields.push(`email = $${++paramCount}`);
      values.push(updates.email);
    }
    if (updates.phone !== undefined) {
      updateFields.push(`phone = $${++paramCount}`);
      values.push(updates.phone);
    }
    if (updates.relationship !== undefined) {
      updateFields.push(`relationship = $${++paramCount}`);
      values.push(updates.relationship);
    }
    if (updates.allocationPercentage !== undefined) {
      updateFields.push(`allocation_percentage = $${++paramCount}`);
      values.push(updates.allocationPercentage);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    values.unshift(id);
    const result = await query(`
      UPDATE beneficiaries 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, values);

    const beneficiary = result.rows[0];

    res.json({
      message: 'Beneficiary updated successfully',
      beneficiary: {
        id: beneficiary.id,
        firstName: beneficiary.first_name,
        lastName: beneficiary.last_name,
        email: beneficiary.email,
        phone: beneficiary.phone,
        dateOfBirth: beneficiary.date_of_birth,
        relationship: beneficiary.relationship,
        allocationPercentage: beneficiary.allocation_percentage,
        kycStatus: beneficiary.kyc_status,
        updatedAt: beneficiary.updated_at
      }
    });

  } catch (error) {
    console.error('Update beneficiary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove beneficiary from trust
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Verify beneficiary belongs to user's trust
    const beneficiaryResult = await query(`
      SELECT b.id FROM beneficiaries b
      JOIN trust_accounts t ON b.trust_id = t.id
      WHERE b.id = $1 AND t.user_id = $2
    `, [id, userId]);

    if (beneficiaryResult.rows.length === 0) {
      return res.status(404).json({ error: 'Beneficiary not found' });
    }

    // Delete beneficiary
    await query('DELETE FROM beneficiaries WHERE id = $1', [id]);

    res.json({ message: 'Beneficiary removed successfully' });

  } catch (error) {
    console.error('Remove beneficiary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
