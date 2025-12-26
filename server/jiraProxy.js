
/**
 * ============================================================
 * Jira Proxy — API v3 (search/jql)
 * ============================================================
 *
 * Sprint:
 * - Uses board-scoped openSprints()
 * - Main App (346), Marketing (71)
 *
 * Roadmap:
 * - Business Roadmap only (BZ, board 783)
 *
 * ============================================================
 */

import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

/**
 * ============================================================
 * ENV
 * ============================================================
 */
const {
  JIRA_BASE_URL,
  JIRA_EMAIL,
  JIRA_API_TOKEN
} = process.env;

if (!JIRA_BASE_URL || !JIRA_EMAIL || !JIRA_API_TOKEN) {
  console.error('❌ Jira env variables missing');
}

/**
 * ============================================================
 * Auth Headers
 * ============================================================
 */
function jiraHeaders() {
  const token = Buffer.from(
    `${JIRA_EMAIL}:${JIRA_API_TOKEN}`
  ).toString('base64');

  return {
    Authorization: `Basic ${token}`,
    Accept: 'application/json',
    'Content-Type': 'application/json'
  };
}

/**
 * ============================================================
 * Board Configuration (AUTHORITATIVE)
 * ============================================================
 */
const SPRINT_BOARD_IDS = [346, 71]; // Main App, Marketing
const ROADMAP_PROJECT = 'BZ';

/**
 * ============================================================
 * Sprint Endpoint
 * ============================================================
 */
router.get('/sprint', async (req, res) => {
  try {
    const jql = `
      Sprint in openSprints(${SPRINT_BOARD_IDS.join(',')})
      ORDER BY priority DESC
    `;

    const response = await fetch(
      `${JIRA_BASE_URL}/rest/api/3/search/jql`,
      {
        method: 'POST',
        headers: jiraHeaders(),
        body: JSON.stringify({
          jql,
          maxResults: 50
        })
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error('❌ Jira sprint raw response:', text);
      throw new Error('Jira sprint fetch failed');
    }

    const data = await response.json();

    const issues = data.issues.map(issue => ({
      key: issue.key,
      summary: issue.fields.summary,
      status: issue.fields.status.name,
      assignee: issue.fields.assignee?.displayName || 'Unassigned',
      url: `${JIRA_BASE_URL}/browse/${issue.key}`
    }));

    res.json({ success: true, issues });

  } catch (err) {
    console.error('❌ Jira sprint error:', err.message);
    res.status(500).json({ success: false, error: 'Jira sprint fetch failed' });
  }
});

/**
 * ============================================================
 * Roadmap Endpoint (Business Roadmap ONLY)
 * ============================================================
 */
router.get('/roadmap', async (req, res) => {
  try {
    const jql = `
      project = ${ROADMAP_PROJECT}
      AND issuetype IN (Epic, Initiative)
      ORDER BY created DESC
    `;

    const response = await fetch(
      `${JIRA_BASE_URL}/rest/api/3/search/jql`,
      {
        method: 'POST',
        headers: jiraHeaders(),
        body: JSON.stringify({
          jql,
          maxResults: 50
        })
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error('❌ Jira roadmap raw response:', text);
      throw new Error('Jira roadmap fetch failed');
    }

    const data = await response.json();

    const issues = data.issues.map(issue => ({
      key: issue.key,
      summary: issue.fields.summary,
      status: issue.fields.status.name,
      percentage: issue.fields.progress?.percent || 0,
      url: `${JIRA_BASE_URL}/browse/${issue.key}`
    }));

    res.json({ success: true, issues });

  } catch (err) {
    console.error('❌ Jira roadmap error:', err.message);
    res.status(500).json({ success: false, error: 'Jira roadmap fetch failed' });
  }
});

export default router;

/**
 * ============================================================
 * TinyURL-Intranet-2025 © VeverlieAnneMarquez
 * Version: 1.0.251226
 * SHA256 Hash of this exact file content:
 * <<< GENERATE AFTER FINAL APPROVAL >>>
 * ============================================================
 */

/**
 * ============================================================
 * DEBUG: List Active Sprints for Board
 * ============================================================
 */
router.get('/debug/active-sprints', async (req, res) => {
  try {
    const boardId = 346; // Main App board (change to 71 for Marketing)

    const response = await fetch(
      `${JIRA_BASE_URL}/rest/agile/1.0/board/${boardId}/sprint?state=active`,
      {
        headers: jiraHeaders()
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ error: text });
    }

    const data = await response.json();
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

