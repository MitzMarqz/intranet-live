/**
 * ============================================================
 * Google Chat Proxy — Daily Standup (Plain Message)
 * ============================================================
 *
 * Purpose:
 * - Accept Daily Standup submissions from frontend
 * - Post a simple text message to Google Chat Space
 * - NO mentions
 * - NO cards
 * - NO annotations
 * - NO frontend secrets
 *
 * ============================================================
 */

import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

/**
 * ============================================================
 * ENV (LOCKED VARIABLE NAME)
 * ============================================================
 */
const CHAT_WEBHOOK_URL = process.env.GOOGLE_CHAT_WEBHOOK;

if (!CHAT_WEBHOOK_URL) {
  console.error('❌ GOOGLE_CHAT_WEBHOOK is missing in .env');
}

/**
 * ============================================================
 * Health Check
 * ============================================================
 */
router.get('/health', (req, res) => {
  res.json({ ok: true, service: 'chat-proxy' });
});

/**
 * ============================================================
 * POST /api/chat/standup
 * ============================================================
 */
router.post('/standup', async (req, res) => {
  try {

    const { message, submittedBy } = req.body;


    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Missing standup message' });
    }

    if (!CHAT_WEBHOOK_URL) {
      return res.status(500).json({ error: 'Chat webhook not configured' });
    }


     const payload = {
  	text: `🧍 Daily Standup\nSubmitted by: ${submittedBy}\n\n${message}`
    };


    const response = await fetch(CHAT_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('❌ Google Chat API error:', errText);
      return res.status(500).json({ error: 'Failed to post standup to Chat' });
    }

    res.json({ success: true });

  } catch (err) {
    console.error('❌ Chat standup error:', err);
    res.status(500).json({ error: 'Chat proxy failure' });
  }
});

export default router;

/**
 * ============================================================
 * DIGITAL SIGNATURE AND OWNERSHIP
 * ============================================================
 * TinyURL-Intranet-2025 © VeverlieAnneMarquez
 * Version: 1.0.251225
 * SHA256 Hash of this exact file content:
 * <<< GENERATE AFTER FINAL APPROVAL >>>
 * ============================================================
 */
