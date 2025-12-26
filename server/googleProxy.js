/**
 * ==========================================
 * Google Apps Script Proxy
 * ==========================================
 * - Forwards requests from frontend to GAS
 * - Keeps GAS URL hidden from browser
 * - Ensures JSON-safe responses
 */

console.log('DEBUG APPS_SCRIPT_URL =', process.env.APPS_SCRIPT_URL);


import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { endpoint, query } = req.query;

    if (!endpoint) {
      return res.status(400).json({ error: "Missing endpoint parameter" });
    }

    // Build GAS URL safely
    let url = `${process.env.APPS_SCRIPT_URL}?endpoint=${encodeURIComponent(endpoint)}`;

    if (query) {
      url += `&query=${encodeURIComponent(query)}`;
    }

    // Call Apps Script
    const response = await fetch(url);

    // Read raw text first (important)
    const text = await response.text();

    // Attempt to parse JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("GAS returned non-JSON:", text);
      return res.status(500).json({ error: "Invalid JSON from Apps Script" });
    }

    res.json(data);
  } catch (error) {
    console.error("Google proxy error:", error);
    res.status(500).json({ error: "Google proxy failed" });
  }
});

export default router;

/**
 * =========================================================
 * POST /api/google/standup
 * Purpose:
 * - Receives standup text from frontend
 * - Sends message to Google Chat Space via webhook
 * =========================================================
 */
router.post('/standup', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Missing standup message'
      });
    }

    const webhookUrl = process.env.GOOGLE_CHAT_WEBHOOK_URL;

    if (!webhookUrl) {
      return res.status(500).json({
        success: false,
        error: 'Google Chat webhook not configured'
      });
    }

    const payload = {
      text: `🧑‍💻 *Daily Standup Update*\n\n${message}`
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Google Chat webhook failed');
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Google Chat standup error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to post standup to Google Chat'
    });
  }
});

