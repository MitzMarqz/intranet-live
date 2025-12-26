/**
 * =========================================================
 * Auth Utility (SINGLE SOURCE OF TRUTH)
 * =========================================================
 * Widgets should NEVER read localStorage directly.
 * This file abstracts auth implementation.
 * =========================================================
 */

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('currentUser'));
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return !!getCurrentUser();
}

export function logout() {
  localStorage.removeItem('currentUser');
}
