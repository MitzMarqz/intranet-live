/**
 * Frontend API Configuration (Secure & Verified)
 */

export const API_BASE_URL = 'http://localhost:5175';

export const JIRA_API = `${API_BASE_URL}/api/jira`;
export const CHAT_API = `${API_BASE_URL}/api/chat`;
export const GOOGLE_API = `${API_BASE_URL}/api/google`;
export const STANDUP_API = `${CHAT_API}/standup`;

/**
 * 🔑 Resource backend (Node, NOT Google Apps Script)
 */
export const RESOURCE_API = `${API_BASE_URL}/api/resources`;
