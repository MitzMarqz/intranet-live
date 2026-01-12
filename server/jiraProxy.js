import express from 'express'
import fetch from 'node-fetch'

const router = express.Router()

const {
  JIRA_BASE_URL,
  JIRA_EMAIL,
  JIRA_API_TOKEN
} = process.env

/* =========================================================
 * AUTH / HEADERS
 * ========================================================= */
function jiraHeaders() {
  const token = Buffer.from(
    `${JIRA_EMAIL}:${JIRA_API_TOKEN}`
  ).toString('base64')

  return {
    Authorization: `Basic ${token}`,
    Accept: 'application/json'
  }
}

/* =========================================================
 * GENERIC SEARCH
 * ========================================================= */
async function jiraSearch(jql, fields) {
  const url =
    `${JIRA_BASE_URL}/rest/api/3/search/jql` +
    `?jql=${encodeURIComponent(jql)}` +
    `&maxResults=200` +
    `&fields=${fields}`

  const res = await fetch(url, {
    method: 'GET',
    headers: jiraHeaders()
  })

  if (!res.ok) {
    const text = await res.text()
    console.error('❌ Jira search failed:', text)
    throw new Error('Jira request failed')
  }

  return res.json()
}

/* =========================================================
 * MAP ISSUES (USED BY ALL WIDGETS)
 * ========================================================= */
function mapIssues(data) {
  return (data.issues || []).map(i => ({
    key: i.key,
    summary: i.fields.summary || '',
    status: i.fields.status?.name || '',
    assignee: i.fields.assignee?.displayName || 'Unassigned',
    updated: i.fields.updated || null,
    progress: {
      done: i.fields.progress?.progress || 0,
      total: i.fields.progress?.total || 0
    },
    url: `${JIRA_BASE_URL}/browse/${i.key}`
  }))
}

/* =========================================================
 * SPRINT ROUTES — UNCHANGED
 * ========================================================= */
router.get('/sprint/main', async (_, res) => {
  try {
    const jql =
      'project in ("Business Roadmap","TINYURL KAN","Marketing","Devops/Maintenance","Design","Quarterly Rocks - Leadership") ' +
      'AND sprint in openSprints() ' +
      'AND sprint = "TinyURL Sprint" ' +
      'ORDER BY updated DESC'

    const data = await jiraSearch(
      jql,
      'key,summary,status,assignee,updated,issuetype,progress'
    )

    res.json({ success: true, issues: mapIssues(data) })
  } catch (err) {
    console.error('❌ sprint/main error:', err)
    res.status(500).json({ success: false })
  }
})

router.get('/sprint/marketing', async (_, res) => {
  try {
    const jql =
      'project = Marketing AND sprint in openSprints() ORDER BY updated DESC'

    const data = await jiraSearch(
      jql,
      'key,summary,status,assignee,updated,issuetype,progress'
    )

    res.json({ success: true, issues: mapIssues(data) })
  } catch (err) {
    console.error('❌ sprint/marketing error:', err)
    res.status(500).json({ success: false })
  }
})

/* =========================================================
 * KANBAN ROUTES — DESIGN / ABUSE (UNCHANGED)
 * ========================================================= */
router.get('/kanban/design', async (_, res) => {
  try {
    const jql =
      'project in ("Design","Business Roadmap","TINYURL KAN") ORDER BY updated DESC'

    const data = await jiraSearch(
      jql,
      'key,summary,status,assignee,updated,issuetype,progress'
    )

    res.json({ success: true, issues: mapIssues(data) })
  } catch (err) {
    console.error('❌ kanban/design error:', err)
    res.status(500).json({ success: false })
  }
})

router.get('/kanban/abuse', async (_, res) => {
  try {
    const jql = 'project = "Abuse Kanban" ORDER BY updated DESC'

    const data = await jiraSearch(
      jql,
      'key,summary,status,assignee,updated,issuetype,progress'
    )

    res.json({ success: true, issues: mapIssues(data) })
  } catch (err) {
    console.error('❌ kanban/abuse error:', err)
    res.status(500).json({ success: false })
  }
})

/* =========================================================
 * TEAMS — BOARD 608 (SOURCE OF TRUTH)
 * ========================================================= */
router.get('/kanban/teams', async (_, res) => {
  try {
    // 1️⃣ Get board config to extract filterId
    const boardId = 608
    const boardUrl =
      `${JIRA_BASE_URL}/rest/agile/1.0/board/${boardId}/configuration`

    const boardRes = await fetch(boardUrl, {
      method: 'GET',
      headers: jiraHeaders()
    })

    if (!boardRes.ok) {
      const text = await boardRes.text()
      console.error('❌ Failed to fetch board config:', text)
      throw new Error('Board config failed')
    }

    const boardConfig = await boardRes.json()
    const filterId = boardConfig?.filter?.id

    if (!filterId) {
      throw new Error('Board filter ID not found')
    }

    // 2️⃣ Execute search using board filter
    const jql = `filter = ${filterId} ORDER BY updated DESC`

    const data = await jiraSearch(
      jql,
      'key,summary,status,assignee,updated,issuetype,progress'
    )

    res.json({ success: true, issues: mapIssues(data) })
  } catch (err) {
    console.error('❌ kanban/teams (board 608) error:', err)
    res.status(500).json({ success: false })
  }
})

/* =========================================================
 * BUSINESS ROADMAP — UNCHANGED
 * ========================================================= */
const DONE_STATUSES = ['Done', 'Closed', 'Resolved']
const IN_PROGRESS_STATUSES = [
  'In progress','In Progress','In Review','Reopened','QA',
  'Code Review','Ready for QA','Staging','Dev','Development',
  'Ready to Release to Live','On Review','Blocked'
]
const TODO_STATUSES = ['To Do', 'Backlog', 'Selected for Development']

function computeEpicProgress(children = []) {
  const total = children.length
  if (total === 0) {
    return {
      percentage: 0,
      color: 'none',
      counts: { done: 0, inProgress: 0, todo: 0, total: 0 }
    }
  }

  let done = 0
  let inProgress = 0
  let todo = 0

  children.forEach(c => {
    const status = c.status || ''
    if (DONE_STATUSES.includes(status)) done++
    else if (IN_PROGRESS_STATUSES.includes(status)) inProgress++
    else todo++
  })

  const percentage = Math.round((done / total) * 100)
  const color =
    done === total ? 'green' :
    inProgress > 0 ? 'yellow' :
    'none'

  return {
    percentage,
    color,
    counts: { done, inProgress, todo, total }
  }
}

router.get('/roadmap', async (_, res) => {
  try {
    const epicJql =
      'project = "BZ" AND issuetype = Epic ORDER BY updated DESC'

    const epicData = await jiraSearch(
      epicJql,
      'key,summary,assignee,updated'
    )

    const epics = epicData.issues || []
    if (!epics.length) {
      return res.json({ success: true, issues: [] })
    }

    const epicKeys = epics.map(e => e.key)

    const childrenJql = `parent in (${epicKeys.join(',')})`
    const childrenData = await jiraSearch(
      childrenJql,
      'key,status,parent'
    )

    const childrenByEpic = {}
    ;(childrenData.issues || []).forEach(issue => {
      const parentKey = issue.fields.parent?.key
      if (!parentKey || !epicKeys.includes(parentKey)) return
      childrenByEpic[parentKey] ??= []
      childrenByEpic[parentKey].push({
        key: issue.key,
        status: issue.fields.status?.name || ''
      })
    })

    const roadmap = epics.map(epic => {
      const children = childrenByEpic[epic.key] || []
      const progress = computeEpicProgress(children)

      return {
        key: epic.key,
        summary: epic.fields.summary || '',
        assignee: epic.fields.assignee?.displayName || 'Unassigned',
        updated: epic.fields.updated || null,
        url: `${JIRA_BASE_URL}/browse/${epic.key}`,
        children,
        progress
      }
    })

    res.json({ success: true, issues: roadmap })
  } catch (err) {
    console.error('❌ Roadmap error:', err)
    res.status(500).json({ success: false })
  }
})

export default router
