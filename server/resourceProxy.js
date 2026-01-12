import express from 'express'
import fetch from 'node-fetch'

const router = express.Router()

/* ===============================
 * ENV CONFIG (HIDDEN FROM FRONTEND)
 * =============================== */
const {
  JIRA_BASE_URL,
  CONFLUENCE_EMAIL,
  CONFLUENCE_API_TOKEN,
  APPS_SCRIPT_URL, // Your Apps Script /exec URL
} = process.env

const safeJson = (res, payload) => {
  try {
    res.json(payload)
  } catch {
    res.end()
  }
}

/* ===============================
 * CONFLUENCE SEARCH (UNCHANGED)
 * =============================== */
async function searchConfluence(q) {
  if (!JIRA_BASE_URL || !CONFLUENCE_API_TOKEN || !CONFLUENCE_EMAIL) return []
  
  const url = `${JIRA_BASE_URL}/wiki/rest/api/content/search?cql=text~"${q}"&limit=10`
  const auth = Buffer.from(`${CONFLUENCE_EMAIL}:${CONFLUENCE_API_TOKEN}`).toString('base64')

  const res = await fetch(url, {
    headers: { 'Authorization': `Basic ${auth}`, 'Accept': 'application/json' },
  })
  if (!res.ok) return []
  const data = await res.json()
  return (data.results || []).map((item) => ({
    title: item.title,
    url: `${JIRA_BASE_URL}${item._links.webui}`,
    source: 'confluence',
  }))
}

/* ===============================
 * GOOGLE DRIVE SEARCH (VIA GAS PROXY)
 * =============================== */
async function searchDrive(q) {
  // Uses the URL from your .env file - hidden from the user
  if (!APPS_SCRIPT_URL) {
    console.error('❌ APPS_SCRIPT_URL is missing in .env')
    return []
  }

  try {
    // Construct request to your Apps Script
    const targetUrl = `${APPS_SCRIPT_URL}?endpoint=resources&query=${encodeURIComponent(q)}`

    const res = await fetch(targetUrl)
    if (!res.ok) return []

    const data = await res.json()

    // Map GAS results to your internal Intranet format
    if (data.success && data.files) {
      return data.files.map((f) => ({
        title: f.name,
        url: f.url,
        source: 'drive',
      }))
    }
    return []
  } catch (err) {
    console.error('❌ Drive Proxy Error:', err.message)
    return []
  }
}

/* ===============================
 * FIGMA (UNCHANGED)
 * =============================== */
function searchFigma(q) {
  return [{ title: `Search "${q}" in Figma`, url: 'www.figma.com', source: 'figma' }]
}

/* ===============================
 * MAIN ROUTE
 * =============================== */
router.get('/search', async (req, res) => {
  const { source, q } = req.query

  if (!q || !source) {
    return safeJson(res, { success: true, results: [] })
  }

  try {
    let results = []
    if (source === 'drive') {
      results = await searchDrive(q)
    } else if (source === 'confluence') {
      results = await searchConfluence(q)
    } else if (source === 'figma') {
      results = searchFigma(q)
    }
    safeJson(res, { success: true, results })
  } catch (err) {
    safeJson(res, { success: false, results: [] })
  }
})

export default router
