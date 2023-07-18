// Import required libraries
const express = require('express');
const jwt = require('jsonwebtoken');

// Create an instance of Express.js
const app = express();
app.use(express.json());

// Secret key for JWT
const jwtSecretKey = 'your_secret_key';

// In-memory user store (Replace with your database or user store logic)
const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' }
];


app.get("/" , (req , res)=>{
res.send('App is running')
}
// Login API endpoint
app.post('/login', (req, res) => {
  // Extract username and password from request body
  const { username, password } = req.body;

  // Find the user by username and password
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Generate a JWT token
  const token = jwt.sign({ userId: user.id }, jwtSecretKey, { expiresIn: '1h' });

  // Return the token in the response
  res.json({ token });
});

// Protected API endpoint (example)
app.get('/protected', authenticateToken, (req, res) => {
  // If the execution reaches here, the token is valid
  res.json({ message: 'Protected API endpoint reached!' });
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  // Extract the token from the Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }

  // Verify the token
  jwt.verify(token, jwtSecretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    // Attach the user data to the request object for further use
    req.user = user;
    next();
  });
}

// Start the server
const port =  process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
