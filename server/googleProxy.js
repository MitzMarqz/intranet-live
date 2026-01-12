/**
 * =========================================================
 * Google Apps Script Proxy
 * =========================================================
 * Purpose:
 * - Securely proxy frontend requests to Google Apps Script
 * - Avoid CORS issues
 * - Keep GAS URL hidden from frontend
 *
 * IMPORTANT:
 * - Availability, OOO, and Resources routes MUST remain untouched
 * =========================================================
 */

import express from 'express'
import fetch from 'node-fetch'

const router = express.Router()
const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL

// REQUIRED: allow JSON body parsing for POST
router.use(express.json())

/**
 * =========================================================
 * MAIN PROXY ROUTE (GET + POST)
 * =========================================================
 * Usage:
 * GET  /api/google?endpoint=availability
 * GET  /api/google?endpoint=leaves
 * GET  /api/google?endpoint=resources
 * POST /api/google?endpoint=logPost
 */
router.all('/', async (req, res) => {
  try {

  console.log('🔵 GOOGLE PROXY HIT', {
  method: req.method,
  endpoint: req.query.endpoint
})



    if (!APPS_SCRIPT_URL) {
      return res.status(500).json({ error: 'APPS_SCRIPT_URL missing' })
    }

    const endpoint = req.query.endpoint
    if (!endpoint) {
      return res.status(400).json({ error: 'Missing endpoint param' })
    }
    

    const response = await fetch(`${APPS_SCRIPT_URL}?endpoint=${endpoint}`, {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
      body: req.method === 'POST' ? JSON.stringify(req.body) : undefined
    })

    const text = await response.text()

    // TEMP DEBUG – safe to remove later
    console.log('GAS RAW RESPONSE:', text)

    res.setHeader('Content-Type', 'application/json')
    res.status(200).send(text)

  } catch (err) {
    console.error('Google proxy error:', err)
    res.status(500).json({ error: err.message })
  }
})

export default router
