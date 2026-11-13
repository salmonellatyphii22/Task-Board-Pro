
import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './src/config/db.js';

import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import workspaceRoutes from './src/routes/workspaceRoutes.js';
import sprintRoutes from './src/routes/sprintRoutes.js';
import taskRoutes from './src/routes/taskRoutes.js';
import dashboardRoutes from './src/routes/dashboardRoutes.js';
import activityLogRoutes from './src/routes/activityLogRoutes.js';

import { errorHandler } from './src/middleware/errorHandler.js';
import { initSocket } from './src/sockets/socketHandler.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express application
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO real-time engine
initSocket(server);

// Middleware
const clientUrl = process.env.CLIENT_URL || '*';

app.use(
  cors({
    origin: clientUrl,
    credentials: true
  })
);

app.use(express.json());

// =================================
// PUBLIC HEALTH CHECK ROUTE
// =================================

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Task Board API is running with Socket.io real-time engine',
    timestamp: new Date().toISOString()
  });
});

// =================================
// APPLICATION API ROUTES
// =================================

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/activity-logs', activityLogRoutes);
app.use('/api', sprintRoutes);
app.use('/api', taskRoutes);

// =================================
// GLOBAL ERROR HANDLER
// =================================

app.use(errorHandler);

// =================================
// START SERVER
// =================================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
  );
});
