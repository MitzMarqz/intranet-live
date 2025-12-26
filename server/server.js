// server/server.js
import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());

const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_BASE_URL = process.env.JIRA_BASE_URL || 'https://yourcompany.atlassian.net';

// Board IDs – adjust if needed
const BOARD_IDS = {
  main: 346,
  marketing: 71,
  abuse: 77,
  design: 378,
  teams: 608
};

// Helper: Basic auth header
const getAuthHeader = () => {
  const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');
  return { Authorization: `Basic ${auth}` };
};

// ==========================
// Issues endpoint (existing)
// ==========================
app.get('/api/jira/issues/:type', async (req, res) => {
  const type = req.params.type;
  const boardId = BOARD_IDS[type] || BOARD_IDS.main;

  try {
    let issues = [];

    if (type === 'main' || type === 'marketing') {
      const sprintResp = await axios.get(
        `${JIRA_BASE_URL}/rest/agile/1.0/board/${boardId}/sprint?state=active`,
        { headers: getAuthHeader() }
      );

      const activeSprint = sprintResp.data.values?.[0];
      if (!activeSprint) return res.status(404).json({ error: 'No active sprint found' });

      const issuesResp = await axios.get(
        `${JIRA_BASE_URL}/rest/agile/1.0/sprint/${activeSprint.id}/issue`,
        { headers: getAuthHeader() }
      );
      issues = issuesResp.data.issues || [];
    } else {
      const boardIssuesResp = await axios.get(
        `${JIRA_BASE_URL}/rest/agile/1.0/board/${boardId}/issue`,
        { headers: getAuthHeader() }
      );
      issues = boardIssuesResp.data.issues || [];
    }

    const formatted = issues.map(issue => ({
      key: issue.key,
      summary: issue.fields.summary,
      assigned: issue.fields.assignee?.displayName || 'Unassigned',
      status: issue.fields.status.name,
      updated: issue.fields.updated
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(err.response?.status || 500).json({ error: 'Failed to fetch Jira issues' });
  }
});

// ==========================
// Roadmap endpoint
// Fetch all epics and progress using JQL (v3 API)
// ==========================
app.get('/api/jira/roadmap', async (req, res) => {
  try {
    const headers = getAuthHeader();

    // 1️⃣ Fetch epics from PROJECT (this matches Jira UI)
    const epicResp = await axios.get(
      `${JIRA_BASE_URL}/rest/api/3/search`,
      {
        headers,
        params: {
          jql: 'project = BZ AND issuetype = Epic ORDER BY created DESC',
          fields: 'summary,status',
          maxResults: 50
        }
      }
    );

    const epics = epicResp.data.issues || [];

    // 2️⃣ Fetch children for each epic and calculate progress
    const roadmap = await Promise.all(
      epics.map(async epic => {
        let percentage = 0;

        try {
          const childrenResp = await axios.get(
            `${JIRA_BASE_URL}/rest/api/3/search`,
            {
              headers,
              params: {
                jql: `"Epic Link" = ${epic.key}`,
                fields: 'status',
                maxResults: 200
              }
            }
          );

          const children = childrenResp.data.issues || [];
          const total = children.length;
          const done = children.filter(
            i => i.fields.status.statusCategory.key === 'done'
          ).length;

          percentage = total > 0 ? Math.round((done / total) * 100) : 0;
        } catch {
          percentage = 0;
        }

        return {
          key: epic.key,
          summary: epic.fields.summary,
          status: epic.fields.status.name,
          percentage,
          url: `${JIRA_BASE_URL}/browse/${epic.key}`
        };
      })
    );

    // ✅ Always return success if epics exist
    res.json({
      success: true,
      issues: roadmap
    });
  } catch (err) {
    console.error('Roadmap fatal error:', err.response?.data || err.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch roadmap'
    });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
