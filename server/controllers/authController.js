
import bcrypt from 'bcryptjs';
import {createUser,findUserByEmail,findUserById} from '../models/userModel.js'; 


import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();












// Register a new user
export const register = async (req, res) => {
  const {  name,email, password } = req.body;

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await createUser({  name,email, password: hashedPassword });

  res.status(201).json({ message: 'User registered', user: newUser });
};

// Login user
export const login = async (req, res) => {
    // fetch email and password from request body (from login form which is from frontend)
  const { email, password } = req.body;
  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
    // Find user by email
    // the function "findUserByEmail" would return all the user data if the email exists
  const user = await findUserByEmail(email);
  // if user's email does not exist, return 404
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
    // Check password

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid password' });
  }
  const token = jwt.sign(
  { id: user.id },
  process.env.JWT_SECRET, 
  { expiresIn: '1d' }
);
   console.log("JWT_SECRET:", process.env.JWT_SECRET);




    // Successful login
    res.json({
    message: 'Login successful',
    token,
    user: { id: user.id, name: user.name, email: user.email }
  });
};


export const getUserProfile = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; 
  console.log("🔹 Received Authorization Header:", req.headers.authorization);
  console.log("🔹 Extracted Token:", token);
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔹 Decoded Token:", decoded);
    const user = await findUserById(decoded.id);
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("❌ JWT Verify Error:", err.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};


