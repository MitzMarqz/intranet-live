/**
 * ===================================
 * Secure Backend Entry Point
 * ===================================
 * TinyURL Intranet Backend - index.js
 * Created: 2025-12-30
 *
 * WARNING:
 * - This is the ONLY file that creates `app`
 * - All proxies are mounted here
 * - NO business logic here
 * ===================================
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import jiraProxy from './jiraProxy.js';
import googleProxy from './googleProxy.js';
import chatProxy from './chatProxy.js';
import resourceProxy from './resourceProxy.js';


const app = express();

/* ================= Middleware ================= */
app.use(cors())

// REQUIRED for JSON payloads
app.use(express.json())

// ✅ REQUIRED for GAS form-encoded payloads
app.use(express.urlencoded({ extended: true }))

/* ================= Health Check ================= */

app.get('/', (req, res) => {
  res.send('✅ Secure API server is running')
})

/* ================= API Routes ================= */
app.use('/api/jira', jiraProxy);     // Sprint + Roadmap
app.use('/api/google', googleProxy); // TM Availability + OOO
app.use('/api/chat', chatProxy);     // Daily Standup
app.use('/api/resources', resourceProxy); // Resource Links


/* ================= Server Start ================= */
const PORT = process.env.PORT || 5175;

app.listen(PORT, () => {
  console.log(`✅ Secure API server running on port ${PORT}`);
});

/* ===================================
   DIGITAL SIGNATURE AND OWNERSHIP
   ===================================
   TinyURL-Intranet-2025 © VeverlieAnneMarquez
   Version: 1.0.20251230
   SHA256 Hash of this exact file —
   <<< GENERATE AFTER FINAL APPROVAL >>>
=================================== */
