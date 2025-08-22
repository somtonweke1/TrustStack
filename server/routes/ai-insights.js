const express = require('express');
const jwt = require('jsonwebtoken');
const AIWrapper = require('../ai/AIWrapper');
const router = express.Router();

// Initialize AI wrapper
const aiWrapper = new AIWrapper();

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Get comprehensive AI insights for a specific trust
router.get('/trust/:trustId', authenticateToken, async (req, res) => {
  try {
    const { trustId } = req.params;
    const insights = await aiWrapper.generateTrustInsights(trustId);
    
    res.json({
      message: 'AI insights generated successfully',
      insights
    });
  } catch (error) {
    console.error('AI Trust Insights error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Get specific analysis type for a trust
router.get('/trust/:trustId/:analysisType', authenticateToken, async (req, res) => {
  try {
    const { trustId, analysisType } = req.params;
    let result;

    switch (analysisType) {
      case 'risk':
        result = await aiWrapper.calculateTrustRiskScore(trustId);
        break;
      case 'optimization':
        result = await aiWrapper.calculateTrustOptimizationScore(trustId);
        break;
      case 'compliance':
        result = await aiWrapper.predictComplianceNeeds(trustId);
        break;
      default:
        return res.status(400).json({ error: 'Invalid analysis type' });
    }

    res.json({
      message: `${analysisType} analysis completed successfully`,
      analysis: result
    });
  } catch (error) {
    console.error('AI Analysis error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Get portfolio-level AI insights for dashboard
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const dashboardData = await aiWrapper.generateDashboardInsights();
    
    res.json({
      message: 'Dashboard insights generated successfully',
      ...dashboardData
    });
  } catch (error) {
    console.error('AI Dashboard error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Get actionable recommendations for a trust
router.get('/trust/:trustId/recommendations', authenticateToken, async (req, res) => {
  try {
    const { trustId } = req.params;
    const insights = await aiWrapper.generateTrustInsights(trustId);
    
    const recommendations = {
      trustId,
      priorityActions: insights.priorityActions,
      riskRecommendations: insights.riskAnalysis.recommendations,
      optimizationRecommendations: insights.optimizationAnalysis.recommendations,
      complianceRecommendations: insights.complianceAnalysis.recommendations,
      generatedAt: new Date().toISOString()
    };

    res.json({
      message: 'Recommendations generated successfully',
      recommendations
    });
  } catch (error) {
    console.error('AI Recommendations error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

module.exports = router;
