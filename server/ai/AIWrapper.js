const RealDatabase = require('../database/real-db');

class AIWrapper {
  constructor() {
    this.db = new RealDatabase();
  }

  async calculateTrustRiskScore(trustId) {
    try {
      // Get trust details
      const trust = await this.db.query(
        'SELECT * FROM trust_accounts WHERE id = ?',
        [trustId]
      );

      if (!trust || trust.length === 0) {
        throw new Error('Trust not found');
      }

      const trustData = trust[0];

      // Get beneficiaries
      const beneficiaries = await this.db.query(
        'SELECT * FROM beneficiaries WHERE trust_id = ?',
        [trustId]
      );

      // Get transfer history
      const transfers = await this.db.query(
        'SELECT * FROM transfers WHERE trust_id = ?',
        [trustId]
      );

      // Get compliance status
      const complianceLogs = await this.db.query(
        'SELECT * FROM compliance_logs WHERE entity_type = ? AND entity_id = ?',
        ['trust', trustId]
      );

      // Calculate risk factors
      let riskScore = 50; // Base score
      let riskFactors = [];
      let recommendations = [];

      // Balance risk (higher balance = higher risk)
      if (trustData.current_balance > 10000000) {
        riskScore += 15;
        riskFactors.push('High trust balance');
      } else if (trustData.current_balance > 5000000) {
        riskScore += 10;
        riskFactors.push('Medium trust balance');
      }

      // Beneficiary complexity
      if (beneficiaries.length > 5) {
        riskScore += 15;
        riskFactors.push('High beneficiary complexity');
      } else if (beneficiaries.length > 2) {
        riskScore += 8;
        riskFactors.push('Medium beneficiary complexity');
      }

      // Compliance risk
      const pendingCompliance = complianceLogs.filter(log => log.status === 'pending');
      if (pendingCompliance.length > 2) {
        riskScore += 20;
        riskFactors.push('Multiple pending compliance items');
      } else if (pendingCompliance.length > 0) {
        riskScore += 10;
        riskFactors.push('Pending compliance items');
      }

      // Transfer activity risk
      const recentTransfers = transfers.filter(t => 
        new Date(t.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      );
      if (recentTransfers.length > 5) {
        riskScore += 12;
        riskFactors.push('High transfer activity');
      }

      // Cap risk score at 100
      riskScore = Math.min(riskScore, 100);

      // Generate recommendations based on risk factors
      if (riskFactors.includes('High trust balance')) {
        recommendations.push('Consider trust splitting for better risk management');
      }
      if (riskFactors.includes('High beneficiary complexity')) {
        recommendations.push('Review beneficiary allocation strategy');
      }
      if (riskFactors.includes('Multiple pending compliance items')) {
        recommendations.push('Prioritize compliance completion');
      }

      return {
        riskScore,
        riskLevel: this.getRiskLevel(riskScore),
        riskFactors,
        recommendations
      };
    } catch (error) {
      throw new Error(`Error calculating trust risk score: ${error.message}`);
    }
  }

  async calculateTrustOptimizationScore(trustId) {
    try {
      // Get trust details
      const trust = await this.db.query(
        'SELECT * FROM trust_accounts WHERE id = ?',
        [trustId]
      );

      if (!trust || trust.length === 0) {
        throw new Error('Trust not found');
      }

      const trustData = trust[0];

      // Get compliance logs
      const complianceLogs = await this.db.query(
        'SELECT * FROM compliance_logs WHERE entity_type = ? AND entity_id = ?',
        ['trust', trustId]
      );

      // Get transfer history
      const transfers = await this.db.query(
        'SELECT * FROM transfers WHERE trust_id = ?',
        [trustId]
      );

      // Calculate optimization factors
      let optimizationScore = 100; // Start with perfect score
      let optimizationFactors = [];
      let potentialSavings = 0;
      let recommendations = [];

      // Compliance delays
      const overdueCompliance = complianceLogs.filter(log => 
        log.status === 'pending' && 
        log.due_date && 
        new Date(log.due_date) < new Date()
      );

      if (overdueCompliance.length > 0) {
        optimizationScore -= 20;
        optimizationFactors.push('Overdue compliance items');
        potentialSavings += 15000; // Estimated cost of delays
        recommendations.push('Complete overdue compliance immediately');
      }

      // Transfer efficiency
      const failedTransfers = transfers.filter(t => t.status === 'failed');
      if (failedTransfers.length > 0) {
        optimizationScore -= 15;
        optimizationFactors.push('Failed transfers');
        potentialSavings += 5000;
        recommendations.push('Review transfer processes');
      }

      // Trust type optimization
      if (trustData.trust_type === 'Revocable Living Trust' && trustData.current_balance > 5000000) {
        optimizationScore -= 10;
        optimizationFactors.push('Large revocable trust');
        recommendations.push('Consider irrevocable trust conversion for tax benefits');
      }

      // Cap optimization score
      optimizationScore = Math.max(optimizationScore, 0);

      return {
        optimizationScore,
        optimizationLevel: this.getOptimizationLevel(optimizationScore),
        optimizationFactors,
        potentialSavings,
        recommendations
      };
    } catch (error) {
      throw new Error(`Error calculating trust optimization score: ${error.message}`);
    }
  }

  async predictComplianceNeeds(trustId) {
    try {
      // Get compliance logs
      const complianceLogs = await this.db.query(
        'SELECT * FROM compliance_logs WHERE entity_type = ? AND entity_id = ?',
        ['trust', trustId]
      );

      // Get trust details
      const trust = await this.db.query(
        'SELECT * FROM trust_accounts WHERE id = ?',
        [trustId]
      );

      if (!trust || trust.length === 0) {
        throw new Error('Trust not found');
      }

      const trustData = trust[0];

      // Calculate compliance timeline
      const now = new Date();
      const lastComplianceCheck = trustData.last_compliance_check ? 
        new Date(trustData.last_compliance_check) : 
        new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000); // Default to 1 year ago

      const daysSinceLastCheck = Math.floor((now - lastComplianceCheck) / (1000 * 60 * 60 * 24));
      const nextComplianceCheck = new Date(lastComplianceCheck.getTime() + 365 * 24 * 60 * 60 * 1000);
      const daysUntilNextCheck = Math.floor((nextComplianceCheck - now) / (1000 * 60 * 60 * 24));

      // Determine compliance priority
      let compliancePriority = 'low';
      let isOverdue = false;

      if (daysSinceLastCheck > 400) {
        compliancePriority = 'high';
        isOverdue = true;
      } else if (daysSinceLastCheck > 300) {
        compliancePriority = 'medium';
      }

      // Generate recommendations
      const recommendations = [];
      if (isOverdue) {
        recommendations.push('Immediate compliance review required');
      } else if (compliancePriority === 'high') {
        recommendations.push('Schedule compliance review within 30 days');
      } else if (compliancePriority === 'medium') {
        recommendations.push('Plan compliance check within 60 days');
      } else {
        recommendations.push('Low priority: Schedule compliance check within 90 days');
      }

      // Add trust-specific recommendations
      if (trustData.current_balance > 10000000) {
        recommendations.push('Consider quarterly compliance monitoring due to trust size');
      }

      return {
        lastComplianceCheck: lastComplianceCheck.toISOString(),
        daysSinceLastCheck,
        nextComplianceCheck: nextComplianceCheck.toISOString(),
        daysUntilNextCheck,
        compliancePriority,
        isOverdue,
        recommendations
      };
    } catch (error) {
      throw new Error(`Error predicting compliance needs: ${error.message}`);
    }
  }

  async generateTrustInsights(trustId) {
    try {
      const [riskAnalysis, optimizationAnalysis, complianceAnalysis] = await Promise.all([
        this.calculateTrustRiskScore(trustId),
        this.calculateTrustOptimizationScore(trustId),
        this.predictComplianceNeeds(trustId)
      ]);

      // Calculate overall score
      const overallScore = Math.round(
        (riskAnalysis.riskScore + optimizationAnalysis.optimizationScore) / 2
      );

      // Determine overall health
      const overallHealth = this.getOverallHealth(overallScore);

      // Generate priority actions
      const priorityActions = this.generatePriorityActions(
        riskAnalysis, 
        optimizationAnalysis, 
        complianceAnalysis
      );

      return {
        overallScore,
        overallHealth,
        riskAnalysis,
        optimizationAnalysis,
        complianceAnalysis,
        priorityActions,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Error generating trust insights: ${error.message}`);
    }
  }

  async generateDashboardInsights() {
    try {
      // Get all trusts
      const trusts = await this.db.query('SELECT * FROM trust_accounts WHERE status = ?', ['active']);
      
      let totalBalance = 0;
      let totalRiskScore = 0;
      let highRiskTrusts = 0;
      const urgentActions = [];

      // Process each trust
      for (const trust of trusts) {
        totalBalance += trust.current_balance;
        
        const insights = await this.generateTrustInsights(trust.id);
        totalRiskScore += insights.overallScore;
        
        if (insights.overallHealth === 'Poor' || insights.riskAnalysis.riskLevel === 'High') {
          highRiskTrusts++;
          
          // Add urgent actions for high-risk trusts
          if (insights.complianceAnalysis.isOverdue) {
            urgentActions.push({
              priority: 'High',
              action: 'Compliance Review',
              description: `${trust.trust_name} needs immediate compliance review`,
              timeline: 'Within 7 days'
            });
          }
        }
      }

      const averageRiskScore = Math.round(totalRiskScore / trusts.length);

      return {
        portfolioInsights: {
          totalTrusts: trusts.length,
          totalBalance,
          averageRiskScore,
          highRiskTrusts,
          urgentActions
        },
        trustInsights: await Promise.all(
          trusts.map(async (trust) => {
            const insights = await this.generateTrustInsights(trust.id);
            return {
              trustId: trust.id,
              trustName: trust.trust_name,
              currentBalance: trust.current_balance,
              status: trust.status,
              complianceStatus: trust.compliance_status,
              insights
            };
          })
        )
      };
    } catch (error) {
      throw new Error(`Error generating dashboard insights: ${error.message}`);
    }
  }

  // Helper methods
  getRiskLevel(score) {
    if (score >= 80) return 'Critical';
    if (score >= 60) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  }

  getOptimizationLevel(score) {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Poor';
  }

  getOverallHealth(score) {
    if (score >= 80) return 'Excellent';
    if (score >= 65) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  }

  generatePriorityActions(riskAnalysis, optimizationAnalysis, complianceAnalysis) {
    const actions = [];

    // High priority actions
    if (complianceAnalysis.isOverdue) {
      actions.push({
        priority: 'High',
        action: 'Compliance Review',
        description: 'Complete overdue compliance requirements',
        timeline: 'Immediate'
      });
    }

    if (riskAnalysis.riskLevel === 'High' || riskAnalysis.riskLevel === 'Critical') {
      actions.push({
        priority: 'High',
        action: 'Risk Mitigation',
        description: 'Implement risk reduction strategies',
        timeline: 'Within 7 days'
      });
    }

    // Medium priority actions
    if (optimizationAnalysis.optimizationScore < 75) {
      actions.push({
        priority: 'Medium',
        action: 'Trust Optimization',
        description: 'Implement optimization recommendations',
        timeline: 'Within 30 days'
      });
    }

    if (complianceAnalysis.compliancePriority === 'medium') {
      actions.push({
        priority: 'Medium',
        action: 'Compliance Planning',
        description: 'Schedule upcoming compliance reviews',
        timeline: 'Within 30 days'
      });
    }

    return actions;
  }

  close() {
    this.db.close();
  }
}

module.exports = AIWrapper;
