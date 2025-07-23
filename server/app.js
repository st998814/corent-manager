

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import memberRoutes from './routes/memberRoutes.js';

const app = express();

app.use(cors({ origin: '*' }));

app.use(express.json());





app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/members', memberRoutes);


app.get('/', (req, res) => {
  res.send(' API is working!');
});



export default app;