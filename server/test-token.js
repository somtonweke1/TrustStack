const jwt = require('jsonwebtoken');

// Generate a test token
const testUser = { userId: 1, email: 'demo@truststack.com' };
const token = jwt.sign(testUser, 'your-secret-key', { expiresIn: '1h' });

console.log('Test JWT Token:');
console.log(token);
console.log('\nUse this token in your Authorization header:');
console.log(`Authorization: Bearer ${token}`);
