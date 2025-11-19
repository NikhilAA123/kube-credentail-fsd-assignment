import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import { verifyTokenMiddleware } from './middleware/authMiddleware';

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(bodyParser.json());

// Public auth routes
app.use('/auth', authRoutes);

// Example protected route
app.get('/me', verifyTokenMiddleware, (req, res) => {
  // @ts-ignore
  res.json({ success: true, user: req.user });
});

app.get('/', (req, res) => res.json({ ok: true, service: 'auth-service' }));

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
