/**
 * The one account no admin (including itself) can demote, disable, or lock
 * out via the app — enforced in backend/firestore.rules' isProtectedAccount().
 * The rules file can't import this, so the email is duplicated there as a
 * literal; keep both in sync if it ever changes.
 */
export const PROTECTED_ADMIN_EMAIL = "eldesouky71@gmail.com";

/**
 * Shown on /auth/pending-approval and /auth/account-disabled as the way to
 * reach the platform admin. Defaults to the same address as the protected
 * admin account above — change this independently if support should go
 * through a different inbox later.
 */
export const SUPPORT_EMAIL = "eldesouky71@gmail.com";
