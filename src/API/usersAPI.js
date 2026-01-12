/**
 * =========================================================
 * Users API (Frontend)
 * =========================================================
 * Talks ONLY to Express proxy
 * NEVER to GAS directly
 * =========================================================
 */

const BASE = '/api/google?endpoint=users'

export async function fetchUsers() {
  const res = await fetch(BASE)
  const json = await res.json()
  return json.users || []
}

export async function addUser(payload) {
  return post({ action: 'addUser', payload })
}

export async function updateUserRole(payload) {
  return post({ action: 'updateRole', payload })
}

export async function revokeUser(payload) {
  return post({ action: 'revokeUser', payload })
}

export async function resetUserPassword(payload) {
  return post({ action: 'resetPassword', payload })
}

async function post(body) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  return res.json()
}