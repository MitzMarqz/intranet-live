/**
 * =========================================================
 * File: chatProxy.js
 * =========================================================
 *
 * Purpose:
 * - Accept POST requests from frontend
 * - Forward messages to Google Chat via Incoming Webhook
 *
 * Endpoint:
 * POST /api/chat/standup
 *
 * Expected body:
 * {
 *   submittedBy: string,
 *   message: string
 * }
 *
 * =========================================================
 */

import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

/**
 * IMPORTANT:
 * - This reads directly from process.env
 * - dotenv MUST be loaded in index.js BEFORE this file is imported
 */
const GOOGLE_CHAT_WEBHOOK_URL = process.env.GOOGLE_CHAT_WEBHOOK_URL;

router.post('/standup', async (req, res) => {
  console.log('Webhook URL:', process.env.GOOGLE_CHAT_WEBHOOK_URL ? 'FOUND' : 'MISSING');
  try {
    const { submittedBy, message } = req.body;

    if (!submittedBy || !message) {
      return res.status(400).json({ success: false, error: 'Invalid payload' });
    }

    if (!GOOGLE_CHAT_WEBHOOK_URL) {
      throw new Error('GOOGLE_CHAT_WEBHOOK_URL is missing');
    }

    await fetch(GOOGLE_CHAT_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `${submittedBy}\n\n${message}`
      })
    });

    res.json({ success: true });
  } catch (err) {
    console.error('chatProxy error:', err.message);
    res.status(500).json({ success: false });
  }
});

export default router;
