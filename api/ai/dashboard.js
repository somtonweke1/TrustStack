// AI Dashboard API endpoint
// This endpoint provides AI-powered insights for the user's portfolio

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if user has any data
    const hasUserData = await checkForUserData();
    
    if (!hasUserData) {
      return res.status(200).json({
        isEmpty: true,
        message: 'No user data found'
      });
    }

    // If user has data, return empty portfolio (no mock data)
    return res.status(200).json({
      isEmpty: true,
      portfolioInsights: {
        totalTrusts: 0,
        totalBalance: 0,
        avgRiskScore: 0,
        highRiskTrusts: 0
      },
      trustInsights: [],
      urgentActions: [],
      message: 'Portfolio is empty'
    });

  } catch (error) {
    console.error('AI Dashboard API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      isEmpty: true 
    });
  }
}

// Mock function to check if user has data
// In production, this would check a real database
async function checkForUserData() {
  // Always return false to ensure no mock data is shown
  return false;
}
