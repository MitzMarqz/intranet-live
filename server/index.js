/**
 * ============================================================
 * Secure Backend Entry Point
 * ============================================================
 *
 * Responsibilities:
 * - Load environment variables (.env)
 * - Start Express server
 * - Register proxy routes (Google Apps Script, Jira)
 *
 * ⚠️ NO API TOKENS ARE EXPOSED HERE
 * ============================================================
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';


import googleProxy from './googleProxy.js';
import jiraProxy from './jiraProxy.js';
import chatProxy from './chatProxy.js';


/**
 * ============================================================
 * App Initialization
 * ============================================================
 */
const app = express();

/**
 * ============================================================
 * Middleware
 * ============================================================
 */
app.use(cors());
app.use(express.json());

/**
 * ============================================================
 * Health Check (VERY IMPORTANT)
 * ============================================================
 */
app.get('/', (req, res) => {
  res.send('✅ Secure API server is running');
});

/**
 * ============================================================
 * Proxy Routes
 * ============================================================
 * These routes keep API tokens OFF the frontend
 */
app.use('/api/google', googleProxy);
app.use('/api/jira', jiraProxy);
app.use('/api/chat', chatProxy);


/**
 * ============================================================
 * Server Startup
 * ============================================================
 */
const PORT = process.env.PORT || 5175;

app.listen(PORT, () => {
  console.log(`✅ Secure API server running on port ${PORT}`);
});

