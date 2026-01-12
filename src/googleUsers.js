/**
 * =========================================================
 * Frontend → Google Apps Script write helper
 * =========================================================
 * - Runs in the browser
 * - Calls Express proxy (/api/google)
 * - NEVER touches server files directly
 * =========================================================
 */

export function writeUserToGAS(endpoint, payload) {
  fetch(`/api/google?endpoint=${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
    .then(res => res.text())
    .then(text => {
      console.log('[GAS RESPONSE]', endpoint, text)
    })
    .catch(err => {
      console.error('GAS write failed:', err)
    })
}

